import React from 'react';
import * as d3 from "d3";
import ReactDOM from 'react-dom'
import XYAxis from './XYAxis';
import crossfilter from 'crossfilter';
import * as d3Col from 'd3-scale-chromatic';

const axMax   = (data)  => d3.max(data, (d) => d.value);

const rScale = (props,length) => {
  return d3.scaleLinear()
    .domain([ 0, axMax(props.dataCont)])
    .range([2, ((props.height-2*props.padding)/length)/2 - 5]);
};

const rScaleOverall = (props,length) => {
  return d3.scaleLinear()
    .domain([ 0, props.maxOverall])
    .range([0, ((props.height-2*props.padding)/length)/2]);
};

const scaleColor = d3.scaleLinear()
                      .domain([ 0, 1])
                      .range([0.10, 0.75]);


const renderRow = (yLoc, props, length, last) => {
  return (coords, index) => {
    const rectProps = {
      x: 1.5*props.padding + index*(props.height-2*props.padding)/length,
      y: yLoc,
      width: (props.height-2*props.padding)/length,
      height: (props.height-2*props.padding)/length,
      fill: "none",
      stroke: "#000000",
    };

    if(last === 1)
    {
      var y2 = 1.5*props.padding + (length-1)*(props.height-2*props.padding)/length;
      return <g key={index} >
                <rect {...rectProps} />
                <rect {...rectProps} y = {y2} />
             </g>
    }
    return <rect {...rectProps} key={index} />;
  };
};

const renderGrid = (props, participants, length) => {
  return (coords, index) => {
    var y = 1.5*props.padding + index*(props.height-2*props.padding)/length;

    const rectProps = {
      x: 1.5*props.padding + (length-1)*(props.height-2*props.padding)/length,
      y: y,
      width: (props.height-2*props.padding)/length,
      height: (props.height-2*props.padding)/length,
      fill: "none",
      stroke: "#000000",
    };

    if(index === participants.length-1)
    {
      return <g key={index}>
              <text x={1.5*props.padding - 20} y={1.5*props.padding + index*(props.height-2*props.padding)/length + ((props.height-2*props.padding)/length)/2 + 5} fill="black" fontSize="14">{index+1}</text>
              <text x={1.5*props.padding + index*(props.height-2*props.padding)/length + ((props.height-2*props.padding)/length)/2 - 5} y={1.5*props.padding-5} fill="black" fontSize="14">{index+1}</text>
              {participants.map(renderRow(y, props, length, 1))}
              <rect {...rectProps} />
             </g>;
    }

    return <g key={index}>
            <text x={1.5*props.padding - 20} y={1.5*props.padding + index*(props.height-2*props.padding)/length + ((props.height-2*props.padding)/length)/2 + 5} fill="black" fontSize="14">{index+1}</text>
            <text x={1.5*props.padding + index*(props.height-2*props.padding)/length + ((props.height-2*props.padding)/length)/2 - 5} y={1.5*props.padding-5} fill="black" fontSize="14">{index+1}</text>
            {participants.map(renderRow(y, props, length, null))}
            <rect {...rectProps} />
           </g>;
  };
};

const renderCircles = (props, length, yAx) => {
  return (coords, index) => {
    const circleProps = {
      r: yAx(coords.value),
      cx: 0,
      cy: 0,
      opacity:1,
      fill: "#6fa3ff",
      className: 'scatter',
      key: index,
    };
    var p1 = parseInt(coords.key.substring(0, 1)) - 1;
    var p2 = parseInt(coords.key.substring(2, 3)) - 1;
    var t = coords.key.substring(1, 2)

    circleProps.cx = 1.5*props.padding + p2*(props.height-2*props.padding)/length + ((props.height-2*props.padding)/length)/2;
    circleProps.cy = 1.5*props.padding + p1*(props.height-2*props.padding)/length + ((props.height-2*props.padding)/length)/2;

    return <circle {...circleProps}><title>{"N: " + coords.value}</title></circle>;
  };
};

const renderTotCircles = (props, length, yAx, role) => {
  return (coords, index) => {
    const circleProps = {
      r: yAx(coords.value),
      cx: 0,
      cy: 0,
      opacity:1,
      fill: "#6fa3ff",
      className: 'scatter',
      key: index,
    };
    var p1 = parseInt(coords.key.substring(0, 1)) - 1;
    var t = coords.key.substring(1, 2);
    var rl = null;
    if(role==="Vic") {
      circleProps.cx = 1.5*props.padding + p1*(props.height-2*props.padding)/length + ((props.height-2*props.padding)/length)/2;
      circleProps.cy = 1.5*props.padding + (length-1)*(props.height-2*props.padding)/length + ((props.height-2*props.padding)/length)/2;
    }
    else {
      circleProps.cx = 1.5*props.padding + (length-1)*(props.height-2*props.padding)/length + ((props.height-2*props.padding)/length)/2;
      circleProps.cy = 1.5*props.padding + p1*(props.height-2*props.padding)/length + ((props.height-2*props.padding)/length)/2;
    }
    return <circle {...circleProps}><title>{"N: " + coords.value}</title></circle>;
  };
};

export default class OverviewGridHist extends React.Component {

  componentWillMount() {
    this.setState({crossData: null, crossDataAtt: null, crossDataVic: null, participants: [1,2,3,4], rSc: null});
  }

  componentDidMount() {
    this.applyFilter();
    this.forceUpdate();
  }

  componentWillReceiveProps() {
    this.applyFilter();
  }

  applyFilter() {
    if(this.props.dataCont != null) {
      var participants = this.state.participants;

      var crossS1 = crossfilter(this.props.dataCont);
      var typeDimensionS1 = crossS1.dimension(function(d) { return d.Attacker + "A"; });
      var scoreDimGroupS1 = typeDimensionS1.group().reduceCount();
      var dS1 = scoreDimGroupS1.top(Infinity);

      var crossS2 = crossfilter(this.props.dataCont);
      var typeDimensionS2 = crossS2.dimension(function(d) { return d.Victim + "A"; });
      var scoreDimGroupS2 = typeDimensionS2.group().reduceCount();
      var dS2 = scoreDimGroupS2.top(Infinity);

      var scalingprops = { ...this.props, dataCont: dS1.concat(dS2)};
      this.state.rSc= rScale(scalingprops, this.state.participants.length+1.5); //Axis scale

      var tmpData = this.props.dataCont;

      var cross1 = crossfilter(this.props.dataCont);
      var typeDimension1 = cross1.dimension(function(d) { return d.Attacker + "A" + d.Victim; });
      var scoreDimGroup1 = typeDimension1.group().reduceCount();
      this.state.crossData = scoreDimGroup1.top(Infinity);

      var cross3 = crossfilter(this.props.dataCont);
      var typeDimension3 = cross3.dimension(function(d) { return d.Attacker + "A"; });
      var scoreDimGroup3 = typeDimension3.group().reduceCount();
      this.state.crossDataAtt = scoreDimGroup3.top(Infinity);

      var cross5 = crossfilter(this.props.dataCont);
      var typeDimension5 = cross5.dimension(function(d) { return d.Victim + "A"; });
      var scoreDimGroup5 = typeDimension5.group().reduceCount();
      this.state.crossDataVic = scoreDimGroup5.top(Infinity);
    }
  }

  ttmouseOver(event,txt) {
    this.props.onTooltip(true,event.clientX,event.clientY,txt);
  }

  ttmouseOut(event) {
    this.props.onTooltip(false,event.clientX,event.clientY,null);
  }

  itemClick() {
    this.props.datasetChanged(this.props.name);
  }

  render() {
    if(this.state.crossData == null) {
      return <div className="dataSelectTile"  style={{height: this.props.height}} style={this.props.position}><p>{this.props.name}</p><p>No Data</p></div>
    }
    else {
      this.applyFilter();
      var overallSc = rScaleOverall(this.props, this.state.participants.length+1.5);
      return (
        <div className="dataSelectTile" title={this.props.overallVal} style={{...this.props.position}}>
          <svg width={this.props.width} height={this.props.height}  onClick={this.itemClick.bind(this)}>
            <text x="6" y="20" fill="black" fontSize="18">{this.props.name}</text>
            <text x={(this.props.height/2 *-1) - this.props.padding/2} y={this.props.padding-10} fill="black" fontSize="15" transform="rotate(-90)" >Actor</text>
            <text x={this.props.height/2 - this.props.padding/1.4} y={this.props.padding} fill="black" fontSize="15">Recipient</text>
            <text x={(this.props.height/2) - this.props.padding-10} y={-this.props.height +10} fill="black" fontSize="15" transform="rotate(90)" >Total Initiated</text>
            <text x={this.props.height/2 - this.props.padding} y={this.props.height -5} fill="black" fontSize="15">Total Recieved</text>

            <g>
              {this.state.participants.map(renderGrid(this.props, this.state.participants, this.state.participants.length +1.5))}
              {this.state.crossData.map(renderCircles(this.props, this.state.participants.length+1.5, this.state.rSc, this.ttmouseOver.bind(this), this.ttmouseOut.bind(this)))}
              {this.state.crossDataVic.map(renderTotCircles(this.props, this.state.participants.length+1.5, this.state.rSc, "Vic", this.ttmouseOver.bind(this), this.ttmouseOut.bind(this)))}
              {this.state.crossDataAtt.map(renderTotCircles(this.props, this.state.participants.length+1.5, this.state.rSc, "Att", this.ttmouseOver.bind(this), this.ttmouseOut.bind(this)))}
            </g>
          </svg>
        </div>
      );
    }
  }
}
