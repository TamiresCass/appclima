//APIs
// https://developer.accuweather.com/
// https://www.geoplugin.com/
//https://account.mapbox.com/auth/signin/?route-to=%22https://account.mapbox.com/%22



    $(function(){


    var appTempoAPIkey="W6KUpJWbFvLIdPoaQuXNXuXE5jWBpyFl";
    var mapBoxToken = "pk.eyJ1IjoidGFtaXJlc2NjIiwiYSI6ImNrZHFtZWl0NTA1ejAyem55aTg5Y3JqNnIifQ.AsctApSjEuLM-2Rdm7CIIw";

    var weatherObj ={
        cidade:"",
        desc:"",
        temp:""
    }

    function preencheClimaAgora(cidade, desc, temp){
        var texto_tela = cidade;
        $(".cidade").text(texto_tela);
        $(".desc").text(desc);
        $(".temp").html(String(temp));
    }

    function pegarTempoAtual(localCode){

        $.ajax({
            url : "http://dataservice.accuweather.com/currentconditions/v1/"+localCode+"?apikey=" +appTempoAPIkey+"&language=pt-br",
            type : "GET",
            dataType: "json",
            success: function(data){
                console.log("current cndicion: ", data);

                weatherObj.temp = data[0].Temperature.Metric.Value;
                weatherObj.desc = data[0].WeatherText;


                console.log(data);
                preencheClimaAgora(weatherObj.cidade,weatherObj.desc, weatherObj.temp);
            },
            error:function(){
                console.log("Erro");
            }

        });
        

    }
    function pegarLocalUsuario(lat,long){
        $.ajax({
            url : "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey="+appTempoAPIkey+"&q=" +lat+ "%2C" +long+ "&language=pt-br",
            type : "GET",
            dataType: "json",
            success: function(data){
                console.log("geoposition: ", data);

                try {
                    weatherObj.cidade = data.ParentCity.LocalizedName;
                }
                catch {
                    weatherObj.cidade = data.LocalizedName;
                }

                weatherObj.desc = data.AdministrativeArea.LocalizedName;

                var localCode = data.Key;
                pegarTempoAtual(localCode)
            },
            error:function(){
                console.log("Erro");
            }

        });
    }

    function pegarCoordenadasDaPesquisa(input){
        input = encodeURI(input);
        $.ajax({
            url : "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ input +".json?access_token="+mapBoxToken,
            type : "GET",
            dataType: "json",
            success: function(data){
                console.log("mapbox: ", data);
                var long = data.features[0].geometry.coordinates[0];
                var lat = data.features[0].geometry.coordinates[1];
                pegarLocalUsuario(lat,long);
            },
            error:function(){
                console.log("Erro");
            }

        });
    }

    function pegarCoordenadasDoIP(){
        var lat_padrao = -23.213635; 
        var long_padrao = -50.635366;

        $.ajax({
            url : "http://www.geoplugin.net/json.gp",
            type : "GET",
            dataType: "json",
            success: function(data){

                if (data.geoplugin_latitude && data.geoplugin_longitude) {
                    pegarLocalUsuario(data.geoplugin_latitude,data.geoplugin_longitude);
                }else{
                    pegarLocalUsuario(lat_padrao,long_padrao); /*Tratativa de erro*/
                }
               
            },
            error:function(){
                console.log("Erro");
                pegarLocalUsuario(lat_padrao,long_padrao);
            }

        });
    }
    pegarCoordenadasDoIP();

    $("#search-button").click(function(){
        var local = $("input#local").val();
        if (local){
            pegarCoordenadasDaPesquisa(local);
        }else{
            alert("Local Invalido"); /*Tratativa de erro*/
        }

    });

});





