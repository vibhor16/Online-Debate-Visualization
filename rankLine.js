import React from 'react';
import * as d3 from "d3";
import * as d3Col from 'd3-scale-chromatic';
import * as d3Array from "d3-array";
import ReactDOM from 'react-dom'
import XYAxis from './XYAxis';

const axMax   = (data, i)  => d3.max(data, (d) => +d[i]);
const axMin   = (data, i)  => d3.min(data, (d) => +d[i]);

const xScale = (min, max, width, pad) => {
  return d3.scaleLinear()
    .domain([min, max])
    .range([pad, width - 2*pad]).nice();
};

const yScale = (min, max, height, pad) => {
  return d3.scaleLinear()
    .domain([min, max ])
    .range([height - pad, pad + 25]).nice();
};

const renderPaths = (props) => {
  return (coords, index) => {
    return <g  key={index}>
              <path d={coords.path} stroke={d3Col.schemeDark2[+coords.participant-1]} strokeWidth={2} fill={"none"}/>
              <line stroke={d3Col.schemeDark2[+coords.participant-1]} strokeWidth={4} fill={"none"} x1={props.width - 1.8*props.padding} y1={41 + 25 + index*15} x2={props.width - 1.45*props.padding} y2={41 + 25 + index*15}/>
              <text x={props.width - 1.4*props.padding} y={45 + 25 + index*15} fill="black" fontSize="12">
                 {"Subject " + coords.participant}
              </text>
            </g>
  };
};

const renderRect = (pad, height,data,xAx) => {
  return (d, index) => {
    var  idx1 = data.map(function(item) { return +item.Time; }).indexOf(+d.min)
    var  idx2 = data.map(function(item) { return +item.Time; }).indexOf(+d.max)
    const rectProps = {
      x:xAx(idx1),
      y:pad+25,
      width: xAx(idx2+1) - xAx(idx1),
      height: height - pad - (pad + 25),
      fill: "#d0d0d0",
      className: 'scatter',
      opacity:0.4,
      index: index,
    };

    return <rect {...rectProps}></rect>
  };
};

export default class RankLine extends React.Component {

  componentWillMount(){
    this.setState({
                    paths: [],
                    xAx: null,
                    yAx: null,
                  });
    this.generatePaths(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.generatePaths(nextProps);
  }

  pnorm(z) {
     // Algorithm AS66 Applied Statistics (1973) vol22 no.3
     // Computes P(Z<z)
     z = parseFloat(z);
     var upper = false;
     var ltone = 7.0;
     var utzero = 18.66;
     var con = 1.28;
     var a1 = 0.398942280444;
     var a2 = 0.399903438504;
     var a3 = 5.75885480458;
     var a4 = 29.8213557808;
     var a5 = 2.62433121679;
     var a6 = 48.6959930692;
     var a7 = 5.92885724438;
     var b1 = 0.398942280385;
     var b2 = 3.8052e-8;
     var b3 = 1.00000615302;
     var b4 = 3.98064794e-4;
     var b5 = 1.986153813664;
     var b6 = 0.151679116635;
     var b7 = 5.29330324926;
     var b8 = 4.8385912808;
     var b9 = 15.1508972451;
     var b10 = 0.742380924027;
     var b11 = 30.789933034;
     var b12 = 3.99019417011;

     var alnorm = 0;
     if(z < 0) {
       upper = !upper;
       z = -z;
     }

     if(z<=ltone || upper && z<=utzero) {
       var y = 0.5*z*z;
       if(z>con) {
         alnorm=b1*Math.exp(-y)/(z-b2+b3/(z+b4+b5/(z-b6+b7/(z+b8-b9/(z+b10+b11/(z+b12))))));
       }
       else {
         alnorm=0.5-z*(a1-a2*y/(y+a3-a4/(y+a5+a6/(y+a7))));
       }
     }
     else {
       alnorm=0;
     }
     if(!upper) alnorm=1-alnorm;
     return(alnorm);
  }

  computeEloScore(eloW, eloL, k) {
    var eloDiff = Math.abs(eloW - eloL) //Elo Winner - Loser
    var zScore = eloDiff/(200*Math.sqrt(2));
    var pWin = this.pnorm(zScore);

    var newEloW = 0;
    var newEloL = 0;

    if(eloW > eloL) {
      //Higher Rated Wins
      newEloW = eloW + (1-pWin)*k;
      newEloL = eloL - (1-pWin)*k;
    }
    else {
      //Lower Rated Wins
      newEloW = eloW + pWin*k;
      newEloL = eloL - pWin*k;
    }
    return {win: newEloW, lose: newEloL};
  }

  computeEloRanks(props, participants) {
    if(props.data.length > 0 ) {
      var eloRanks = [{}]
      var const_K = 100;

      participants.forEach(function(d) {
        eloRanks[0][d] = 1000
      });

      for(var i=0; i < props.data.length; i++) {
        var d = props.data[i]
      //  var indexOfAction = props.selectedActions.indexOf(d["Attack Type"]);
      //  if(indexOfAction >= 0){
          var x = JSON.parse(JSON.stringify(eloRanks[eloRanks.length-1]))
          var newElos = this.computeEloScore(x[d.Attacker], x[d.Victim], 100);
          x[d.Attacker] = newElos.win;
          x[d.Victim] = newElos.lose;
          eloRanks.push(x)
    //    }
      }
      return eloRanks
    }
  }

  computeDavidRanks(props, participants) {
    if(props.data.length > 0 ) {
      var davidRanks = []
      var interMatrix = [];
      var cnt = 0;

      for(var i=0; i < participants.length; i++) {
        interMatrix[i] = new Array(participants.length).fill(0);
      }

      for(var k=0; k < props.data.length; k++) {
        var d = props.data[k]
        interMatrix[+d.Attacker-1][+d.Victim-1] = interMatrix[+d.Attacker-1][+d.Victim-1] + 1;

        if(k%1 === 0 ) {
          var propMatrix = [];
          for(var i=0; i < interMatrix.length; i++) {
            propMatrix[i] = new Array(interMatrix.length).fill(0);
          }
          for(var i=0; i < interMatrix.length; i++) {
            for(var j=0; j < interMatrix.length; j++) {
              if(i!==j) {
                propMatrix[i][j] = interMatrix[i][j] / (interMatrix[i][j] + interMatrix[j][i]);
                propMatrix[i][j] = isNaN(propMatrix[i][j]) ? 0 : propMatrix[i][j];
              }
            }
          }

          var w = [];
          var l = [];
          for(var i=0; i < propMatrix.length; i++) {
            w[i] = 0;
            l[i] = 0;
            for(var j=0; j < interMatrix.length; j++) {
              w[i] = w[i] + propMatrix[i][j];
              l[i] = l[i] + propMatrix[j][i];
            }
          }

          var w2 = [];
          var l2 = [];
          //var DS = []
          for(var i=0; i < propMatrix.length; i++) {
            w2[i] = 0;
            l2[i] = 0;
            for(var j=0; j < interMatrix.length; j++) {
              w2[i] = w2[i] + propMatrix[i][j]*w[j];
              l2[i] = l2[i] + propMatrix[j][i]*l[j];
            }
            //DS[i] = w[i] + w2[i] - l[i] - l2[i];
          }

          var x = {};
          participants.forEach(function(p) {
            x[p] =  w[+p-1] + w2[+p-1] - l[+p-1] - l2[+p-1];
          });
          davidRanks.push(x);
        }

      }
      return davidRanks
    }
  }

  generatePaths(props) {
    if(props.data.length > 0 ) {
      var participants = []
      var atthist = d3Array.rollup(props.data, v => v.length, d => d["Attacker"])
      var vichist = d3Array.rollup(props.data, v => v.length, d => d["Victim"])
      var merged = new Map([...atthist, ...vichist]);
      for (var [key, value] of merged) {
        participants.push(key)
      }
      participants = participants.sort();

      var ranks = []
      var min = Infinity;
      var max = -Infinity;
      if(props.algorithm == "Elo") {
        ranks = this.computeEloRanks(props, participants)
      }
      else {
        ranks = this.computeDavidRanks(props, participants)
      }

      for(var i=0; i < participants.length; i++) {
          var tmpMax = d3.max(ranks, (d) => +d[participants[i]])
          if(tmpMax > max) {
            max = tmpMax;
          }
          var tmpMin = d3.min(ranks, (d) => +d[participants[i]])
          if(tmpMin < min) {
            min = tmpMin;
          }
      }

      var xAx =  xScale(0 , ranks.length, props.width, props.padding)
      var yAx =  yScale(min , max, props.height, props.padding)

      var paths = []
      for(var i=0; i < participants.length; i++) {
        var path = d3.line()
                      .x(function(d, idx) { return xAx(idx); })
                      .y(function(d) { return yAx(d[participants[i]]); });
        paths.push({
                    participant: participants[i],
                    path: path(ranks)
                  })
      }

      this.setState({
                      paths: paths,
                      xAx: xAx,
                      yAx: yAx,
                    });
    }
  }

  onAlgoChanged(event) {
    this.props.onChangeRanking(event.target.value)
  }

  render() {
    return (
      <div className="svgStdiv"  style={{top: this.props.top, width:this.props.width, height: this.props.height, display: "inline-block", boxShadow:"0 0 4px -1px rgba(0,0,0,0.8)"}}>
        <div className="indivdiv" style={{width: 115}}>Rank Evolution</div>
        <div className="svgStdiv" style={{position: "absolute", top: 4, right: 10, width: 84, height: 18}}>
          <select className="metaSelect" value={this.props.algorithm} style={{width: 85, height: 18, fontSize: 11, padding: 0, margin: 0, position: "absolute", background: "#d0d0d0", color: "#000000", borderWidth: 1}}onChange={this.onAlgoChanged.bind(this)}>
            <option value={"Elo"}>{"Elo Ranking"}</option>
            <option value={"David"}>{"David's Score"}</option>
          </select>
        </div>
        <svg width={this.props.width} height={this.props.height} >
          <g className="lineArea">
            {this.state.paths.map(renderPaths(this.props)) }
          </g>
          <g className="lineArea">
            {this.props.selected.map(renderRect(this.props.padding, this.props.height, this.props.data, this.state.xAx)) }
            {this.props.selectedTmp.map(renderRect(this.props.padding, this.props.height, this.props.data, this.state.xAx)) }
          </g>
          <XYAxis {...this.props} xAxis={"Interaction"} yAxis={"Rank"} width={this.props.width-this.props.padding} xScale={this.state.xAx} yScale={this.state.yAx}/>
        </svg>
      </div>

    );
  }
}
