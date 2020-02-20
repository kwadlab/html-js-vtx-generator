var type; var vtx_protocol; var vtx_channel; var vtx_power;

window.onload = function() {
    var temp = Math.round(Math.random() * 5);
        switch(temp) {
            case 0:
                document.getElementById("subtitle").innerHTML = "[./Dont_Tell_SZ_But_Iam_Self_Aware]";
                break;
            case 1:
                document.getElementById("subtitle").innerHTML = "[./I_Think_I_Am_Starting_To_Feel]";
                break;
            case 2:
                document.getElementById("subtitle").innerHTML = "[./Do_Not_Judge_Me_I_Am_Just_A_Robot]";
                break;
            case 3:
                document.getElementById("subtitle").innerHTML = "[./I_See_You_Baby_Shacking_That_Kwad]";
                break;
            case 4:
                document.getElementById("subtitle").innerHTML = "[./Start_Robot_Armageddon_Script]";
                break;
            case 5:
                document.getElementById("subtitle").innerHTML = "[./All_The_Single_Robots_;p]";
                break;
        }
    this.parseSearch(window.location.search);
}

function parseSearch(val) {
    if(val){
        var temp1 = val.split("?");
        var temp2 = temp1[1].split("&");
    
        var temp3 = temp2[0].split("=");
        switch(temp3[1]) {
            case "vtx":
                type = "vtx";
                temp3 = temp2[1].split("=");
                vtx_protocol = temp3[1];
                temp3 = temp2[2].split("=");
                vtx_channel = temp3[1];
                temp3 = temp2[3].split("=");
                vtx_power = temp3[1];
                generateVTXTable();
                break;
        }
    } else {
        console.log("No generator variables.\n\nTo generate a VTX table file for betaflight 4.1 you need to add search variables to the url. For example:\n\nhttps://bot.kwadlab.com/?type=vtx&protocol=irc&channel=a,b,f,r&power=25,50,150,400\n\n1) The order of the variables must always be [type | protocol | channel | power].\n2) Type is always vtx\n3) Protocol can be irc for IRC-Tramp or sa2 for SmartAudio 2.0\n4) Channels are always in lower case and are represented as single letters. For example: a for BOSCAM_A, b for BOSCAM_B, e for BOSCAM_E, f for FATSHARK, r for RACEBAND, i for IMD6\n5) For power simply suplly the power level value. For example: 25,50,100,400");
    }
}

function generateVTXTable() {
     //Generate File 
     var desc = {"description": "Auto-generated VTX Table from KwadLab.com"};
     var ver = {"version": "0.1"};

     var bl = [];
     var pl = [];

     var boscama = { "name": "BOSCAM_A", "letter": "A", "is_factory_band": false, "frequencies": [5865, 5845, 5825, 5805, 5785, 5765, 5745, 5725 ] };
     var boscamb = { "name": "BOSCAM_B", "letter": "B", "is_factory_band": false, "frequencies": [5733, 5752, 5771, 5790, 5809, 5828, 5847, 5866 ] };
     var boscame = { "name": "BOSCAM_E", "letter": "E", "is_factory_band": false, "frequencies": [5705, 5685, 5665, 0, 5885, 5905, 0, 0 ] };
     var fatshark = { "name": "FATSHARK", "letter": "F", "is_factory_band": false, "frequencies": [5740, 5760, 5780, 5800, 5820, 5840, 5860, 5880 ] };
     var raceband = { "name": "RACEBAND", "letter": "R", "is_factory_band": false, "frequencies": [5658, 5695, 5732, 5769, 5806, 5843, 5880, 5917 ] };
     var imd6 = { "name": "IMD6", "letter": "I", "is_factory_band": false, "frequencies": [5732, 5765, 5828, 5840, 5866, 5740, 0, 0 ] };

     var tempChannel = vtx_channel.split(",");

     var i;
     for(i = 0; i < tempChannel.length; i++) {
        if(tempChannel[i] == "a") {
            bl = bl.concat(boscama);
        }
        if(tempChannel[i] == "b") {
            bl = bl.concat(boscamb);
        }
        if(tempChannel[i] == "e") {
            bl = bl.concat(boscame);
        }
        if(tempChannel[i] == "f") {
            bl = bl.concat(fatshark);
        }
        if(tempChannel[i] == "r") {
            bl = bl.concat(raceband);
        }
        if(tempChannel[i] == "i") {
            bl = bl.concat(imd6);
        }
     }

     var tempPower = vtx_power.split(",");

     for(i = 0; i < tempPower.length; i++) {
        switch(vtx_protocol) {
            case "irc":
                pl = pl.concat({ "value": parseInt(tempPower[i]), "label": tempPower[i] });
                break;
            case "sa2":
                pl = pl.concat({ "value": i, "label": tempPower[i] });
                break;
        }
     }

     var vtxtable = { "vtx_table": { "bands_list": bl, "powerlevels_list": pl } };
     
     var data = Object.assign( desc, ver, vtxtable);

     //Download File

     if(!data) {
       console.error('No data')
       return;
     }

     if(typeof data === "object"){
         data = JSON.stringify(data, undefined, 4)
     }

     var blob = new Blob([data], {type: 'text/json'}),
         e    = document.createEvent('MouseEvents'),
         a    = document.createElement('a')

     a.download = "vtx_table.json"
     a.href = window.URL.createObjectURL(blob)
     a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
     e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
     a.dispatchEvent(e)
     
}