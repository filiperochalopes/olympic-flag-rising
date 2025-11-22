class Equipe {
  constructor(nome, apelido, bandeira, hino){
    this.nome = nome;
    this.apelido = apelido;
    this.bandeira = bandeira;
    this.hino = hino;
  }

  setHino(){
    console.log("set hino sounds/hino/"+this.hino);    
  }

  getBandeira(){
    return "<img class='img_bandeira' src='img/bandeiras/"+this.bandeira+"' />";
  }

  getNome(){
    return "<span class='nome'>"+this.nome+"</span>";
  }

}

class Fundo {
  constructor(nome, apelido, url){
    this.nome = nome,
    this.apelido = apelido,
    this.url = "img/fundo/"+url
  }

  getFundo(){
    return "<img class='img_fundo' src='"+this.url+"' />";
  }

  getNome(){
    return "<span class='nome'>"+this.nome+"</span>";
  }
}

minhasEquipes = {};
meusCenarios = {};
cenario = "";
podio = [];
var play = false;
var state = {
  primeiro_visible: false,
  segundo_visible: false,
  terceiro_visible: false,
  quarto_visible: false
}

// ----------------------------- JQUERY

$(document).ready( function(){

  $.getScript( "js/database.json", function( data, textStatus, jqxhr ) {
    array = JSON.parse(data);
    array.forEach(element => {
      minhasEquipes[element.apelido] = new Equipe(element.nome, element.apelido, element.apelido+".jpg", element.apelido+".mp3")  
    });
    // console.log(minhasEquipes);    
  });

  $.getScript( "js/background.json", function( data, textStatus, jqxhr ) {
    array = JSON.parse(data);
    array.forEach(element => {
      meusCenarios[element.apelido] = new Fundo(element.nome, element.apelido, element.url)  
    });
    // console.log(meusCenarios); 
    $("#selecionarFundo").css({
      backgroundImage: "url("+meusCenarios["cefan"].url+")"
    }).find("h2").text(meusCenarios["cefan"].nome)  
  });
    
  $("#menu-bt").click( function(){
    menu = $("#menu_lateral");
    visibilidade = menu.attr("data-visibility");
    if(visibilidade == "hide"){
      $("#menu_lateral").show();
      $("#main_canvas_container").addClass("blur");
      menu.attr("data-visibility", "show");
    }else{
      $("#menu_lateral").hide();
      $("#menu_bandeiras").hide();
      $("#main_canvas_container").removeClass("blur");
      menu.attr("data-visibility", "hide");
    }
  });

  function showBandeiras(datainput, titulo, colocacao){
    $("#bandeiras").text("");
    $("#titulo_principal").text("Selecione um país");
    $("#titulo_input").text("("+titulo+")");
    for (var key in minhasEquipes) {
      nome = minhasEquipes[key].getNome();
      bandeira = minhasEquipes[key].getBandeira();
      $("#bandeiras").append("<div class='bandeira' data-nomebandeira='"+minhasEquipes[key].nome+"' data-apelidobandeira='"+minhasEquipes[key].apelido+"' data-colocacao='"+colocacao+"' data-input='"+datainput+"'><div class='cortina'></div>"+nome+bandeira+"</div>");
    }
    $("#menu_bandeiras").show();
  }

  function showBackground(apelido){
    $("#bandeiras").text("");
    $("#titulo_principal").text("Selecione um fundo");
    $("#titulo_input").text("");
    for (var key in meusCenarios) {
      nome = meusCenarios[key].getNome();
      apelido = meusCenarios[key].apelido;
      url = meusCenarios[key].getFundo();
      $("#bandeiras").append("<div class='background' data-apelido='"+meusCenarios[key].apelido+"'><div class='cortina'></div>"+nome+url+"</div>");
    }
    $("#menu_bandeiras").show();
  }

  function putPodio(colocacao, obj){
    pauseAll();
    colocacao = parseInt(colocacao)-1;
    podio[colocacao] = obj;
    $("#menu_bandeiras").hide();
    console.log(colocacao, obj, podio, !podio[0]);
    if(colocacao == 0){
      setHino(obj);
    }
    if(!podio[0]){
      setHino();
    }
  }

  function setHino(obj=false){
    if(obj){
      $("#hino").show();
      $("#hinomp3").attr("src", "sound/hinos/"+obj.hino);
      document.getElementById("hino").load();
    }else{
      $("#hino").hide();
    }
  }

  function pauseAll(){
    document.getElementById("hino").pause();
  }

  document.getElementById("hino").onended = function() {
    $("#pauseAll").click()
  };


  $(".input_colocacao").click(function(){
    datainput = $(this).attr("data-input");
    titulo = $(this).attr("data-legenda");
    colocacao = $(this).attr("data-colocacao");
    showBandeiras(datainput, titulo, colocacao);
  });

  $("#selecionarFundo").click(function(){
    apelido = $(this).attr("data-apelido");
    showBackground(apelido);
  });

  $("#bandeiras").on("click", ".bandeira", function(){
    idinput = $(this).attr("data-input");
    nome = $(this).attr("data-nomebandeira");
    apelido = $(this).attr("data-apelidobandeira");
    imagem = minhasEquipes[apelido].getBandeira();
    colocacao = $(this).attr("data-colocacao");
    $("#"+idinput).val(apelido);    
    $(".input_colocacao[data-input="+idinput+"]").find("span").text(nome);
    $(".input_colocacao[data-input="+idinput+"]").find(".imagem").html(imagem);
    $(".input_colocacao[data-input="+idinput+"]").css({
      paddingLeft : "120px"
    });
    putPodio(colocacao, minhasEquipes[apelido]);
  });

  $("#bandeiras").on("click", ".background", function(){
    apelido = $(this).attr("data-apelido");   
    $("#selecionarFundo").css({
      backgroundImage : "url("+meusCenarios[apelido].url+")"
    }).find("h2").text(meusCenarios[apelido].nome);
    cenario = meusCenarios[apelido].url;
    $("#menu_bandeiras").hide();

    console.log(cenario);
    
  });

  $("#playAll").click( function(){
    document.getElementById("hino").play();
  })

  $("#pauseAll").click( function(){
    document.getElementById("hino").pause();
  })

  $("#resetAll").click( function(){
    document.getElementById("hino").pause();
    document.getElementById("hino").currentTime = 0;
  })

  $("#togglefirst").click( function(){
    if(state.primeiro_visible){
      $("#togglefirst .hide").show();
      $("#togglefirst .show").hide();
    }else{
      $("#togglefirst .hide").hide();
      $("#togglefirst .show").show();
    }
  })

  $("#togglesecond").click( function(){
    if(state.segundo_visible){
      $("#togglesecond .hide").show();
      $("#togglesecond .show").hide();
    }else{
      $("#togglesecond .hide").hide();
      $("#togglesecond .show").show();
    }
  })

  $("#togglethird").click( function(){
    if(state.terceiro_visible){
      $("#togglethird .hide").show();
      $("#togglethird .show").hide();
    }else{
      $("#togglethird .hide").hide();
      $("#togglethird .show").show();
    }
  })

  $("#togglefourth").click( function(){
    if(state.quarto_visible){
      $("#togglefourth .hide").show();
      $("#togglefourth .show").hide();
    }else{
      $("#togglefourth .hide").hide();
      $("#togglefourth .show").show();
    }
  })

  $("#fullscreen").click( function(){
    i = document.getElementById("main_canvas_container");
    if (i.requestFullscreen) {
      i.requestFullscreen();
    } else if (i.webkitRequestFullscreen) {
      i.webkitRequestFullscreen();
    } else if (i.mozRequestFullScreen) {
      i.mozRequestFullScreen();
    } else if (i.msRequestFullscreen) {
      i.msRequestFullscreen();
    }
  })
    
});
