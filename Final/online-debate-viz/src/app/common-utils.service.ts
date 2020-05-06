declare var $: any;

export function GET_DEBATERS_JSON() {

  var democrats = [];
  var republicans = [];
  var results = {};

  $.ajax({
      url: '../assets/json/debaters.json',
      dataType: 'json',
      async: false,
      success: function(result){
        $.each(result['profiles'], function(i, field){
          if(field.party == "democratic")
            democrats.push(field);
          else
            republicans.push(field);
        });

        results["democrats"] = democrats;
        results["republicans"] = republicans;
      }
    });

    return results;
}

export class VideoObject {
  static obj: any;
  static currentTime: any;
  static taggedEntriesObject: any[];
  static inputVideoURL: any;
  static DUMMY_URL = "https://www.youtube.com/watch?v=F_TYe2wdaGg";
}
