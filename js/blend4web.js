"use strict"

// register the application module
b4w.register("marinha", function(exports, require) {

// import modules used by the app
var m_app       = require("app");
var m_cfg       = require("config");
var m_data      = require("data");
var m_preloader = require("preloader");
var m_ver       = require("version");    
var m_log_nodes = require("logic_nodes");
var m_scenes    = require("scenes");
var m_tex       = require("textures");
var m_ctl       = require("controls");
var m_cam       = require("camera");
var m_vec3      = require("vec3");
var m_trans     = require("transform");
var m_time      = require("time");

// detect application mode
var DEBUG = (m_ver.type() == "DEBUG");

// automatically detect assets path
var APP_ASSETS_PATH = m_cfg.get_assets_path("marinha");

var ANIM_TIME = 5;

var _anim_stop = false;
var _delta_target = ANIM_TIME;
var _cam_anim = {
    timeline: -ANIM_TIME,
    starting_eye: new Float32Array(3),
    starting_target: new Float32Array(3),
    final_eye: new Float32Array(3),
    final_target: new Float32Array(3),
    current_eye: new Float32Array(3),
    current_target: new Float32Array(3)
}

var _vec3_tmp = new Float32Array(3)

/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        show_fps: DEBUG,
        console_verbose: DEBUG,
        autoresize: true,
        show_fps: false,
        // alpha: true,
    });
}

/**
 * callback executed when the app is initialized 
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    // ignore right-click on the canvas element
    canvas_elem.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load("assets/marinha.json", load_cb, preloader_cb);
}

/**
 * update the app's preloader
 */
function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

/**
 * callback executed when the scene data is loaded
 */
function load_cb(data_id, success) {

    if (!success) {
        console.log("b4w load failure");
        return;
    }

    var camobj = m_scenes.get_active_camera();
    init_camera_animation(camobj);

    m_app.enable_camera_controls();

    // place your code here

    function alterarBandeira(colocacao, apelido){
      console.log(colocacao, apelido);
      
      var cube = m_scenes.get_object_by_name(colocacao);
      var image = new Image();
      image.onload = function() {
          m_tex.replace_image(cube, colocacao, image);
      }
      image.src = "./img/bandeiras/"+apelido+".jpg";
    }

    function alterarFundo(){    
      var fundo = m_scenes.get_object_by_name("Fundo");
      var image = new Image();
      image.onload = function() {
          m_tex.replace_image(fundo, "fundo", image);
      }
      image.src = "./"+cenario;
    }

    $("#aplicarbandeiras").click( function(){
      //verifica se tem primeiro lugar
      console.log("podio", podio);
      if(podio[0]){
        podio.forEach( (element, index) => {
          var colocacao_array = [
            "primeiro", "segundo", "terceiro", "quarto"
          ]
          colocacao = colocacao_array[index];
          apelido = element.apelido;
          console.log("colocacao, apelido:", colocacao, apelido);  
          if(podio[index]) alterarBandeira(colocacao, apelido);
        });
      }else{
        alert("Necessita de um primeiro colocado!");
      }  
    })

    $("#bandeiras").on("click", ".background", function(){
      alterarFundo();
    });

    function setFrameRate(duration){
      return (-0.55882352941177) * duration + 69.823529411765
    }

    document.querySelector("#playAll").onclick = function(){
      // animation_framerate
      var duration = $("#hino")[0].duration,
      framerate = setFrameRate(duration);      
      m_cfg.set("animation_framerate", framerate);

      m_log_nodes.run_entrypoint("Scene", "play_hasteamento");
      play = true;
      console.log("Começou a hastear");      
    }

    document.querySelector("#pauseAll").onclick = function(){
      m_log_nodes.run_entrypoint("Scene", "pause_hasteamento");
      play = false;
      console.log("Parou de hastear"); 
    }

    document.querySelector("#resetAll").onclick = function(){
      m_log_nodes.run_entrypoint("Scene", "reset_hasteamento");
      play = false;
      console.log("Restart"); 
    }

    document.querySelector("#togglefirst").onclick = function(){
      var primeiro = m_scenes.get_object_by_name("primeiro");
      var primeiro_visible = m_scenes.is_visible(primeiro);
      if(primeiro_visible){
        m_log_nodes.run_entrypoint("Scene", "hide_primeiro");
      }else{
        m_log_nodes.run_entrypoint("Scene", "show_primeiro");
      }
      state.primeiro_visible = primeiro_visible;
      console.log("Mudou status de visibilidade da primeira bandeira", primeiro_visible); 
    }

    document.querySelector("#togglesecond").onclick = function(){
      var segundo = m_scenes.get_object_by_name("segundo");
      var segundo_visible = m_scenes.is_visible(segundo);
      if(segundo_visible){
        m_log_nodes.run_entrypoint("Scene", "hide_segundo");
      }else{
        m_log_nodes.run_entrypoint("Scene", "show_segundo");
      }
      state.segundo_visible = segundo_visible;
      console.log("Mudou status de visibilidade da segunda bandeira", segundo_visible); 
    }

    document.querySelector("#togglethird").onclick = function(){
      var terceiro = m_scenes.get_object_by_name("terceiro");
      var terceiro_visible = m_scenes.is_visible(terceiro);
      if(terceiro_visible){
        m_log_nodes.run_entrypoint("Scene", "hide_terceiro");
      }else{
        m_log_nodes.run_entrypoint("Scene", "show_terceiro");
      }
      state.terceiro_visible = terceiro_visible;
      console.log("Mudou status de visibilidade da terceira bandeira", terceiro_visible); 
    }

    document.querySelector("#togglefourth").onclick = function(){
      var quarto = m_scenes.get_object_by_name("quarto");
      var quarto_visible = m_scenes.is_visible(quarto);
      if(quarto_visible){
        m_log_nodes.run_entrypoint("Scene", "hide_quarto");
      }else{
        m_log_nodes.run_entrypoint("Scene", "show_quarto");
      }
      state.quarto_visible = quarto_visible;
      console.log("Mudou status de visibilidade da quarta bandeira", quarto_visible); 
    }

    function startAnimation(eye, target){
      _anim_stop = false;
      var pos_view = m_trans.get_translation(eye);
      var pos_target = m_trans.get_translation(target);
      start_camera_animation(camobj, pos_view, pos_target);
    }

    function KeyPress(e) {
      var evtobj = window.event? event : e
      console.log("KeyPress", evtobj.code);

      switch (evtobj.code) {
        case "Digit0":
        ANIM_TIME = 15;
          _anim_stop = true;
          var eye = m_scenes.get_object_by_name("empty_center_loc");
          var target = m_scenes.get_object_by_name("empty_center");
          startAnimation(eye, target);
          break;
        case "Digit1":
          if(evtobj.ctrlKey){
            document.querySelector("#togglefirst").click();
          }else{
            ANIM_TIME = 35;
            _anim_stop = true;
            var eye = m_scenes.get_object_by_name("empty_primeiro_loc");
            var target = m_scenes.get_object_by_name("empty_primeiro");
            startAnimation(eye, target);
            console.log("Animation started", evtobj.code);
          }
          break;
        case "Digit2":
          if(evtobj.ctrlKey){
            document.querySelector("#togglesecond").click();
          }else{
            ANIM_TIME = 20;
            _anim_stop = true;
            var eye = m_scenes.get_object_by_name("empty_left_loc");
            var target = m_scenes.get_object_by_name("empty_center");
            startAnimation(eye, target);
            console.log("Animation started", evtobj.code);
          }
          break;
        case "Digit3":
          if(evtobj.ctrlKey){
            document.querySelector("#togglethird").click();
          }else{
            ANIM_TIME = 20;
            _anim_stop = true;
            var eye = m_scenes.get_object_by_name("empty_right_loc");
            var target = m_scenes.get_object_by_name("empty_center");
            startAnimation(eye, target);
            console.log("Animation started", evtobj.code);
          }
          break;
        case "Digit4":
          if(evtobj.ctrlKey){
            document.querySelector("#togglefourth").click();
          }
          break;
        case "Space":
          if(evtobj.ctrlKey){
            document.querySelector("#resetAll").click();
          }else{
            if(play){
              document.querySelector("#pauseAll").click();
              console.log("Pause");
            }else{
              document.querySelector("#playAll").click();
              console.log("Play");
            }
          }
          break;
        case "KeyT":
          document.querySelector("#fullscreen").click();
          console.log("Tela cheia");
          break;
        default:
          console.log("Nenhuma animação ativada");
          break;
      }
    }

    document.onkeydown = KeyPress;

}

function start_camera_animation(camobj, pos_view, pos_target) {
  // retrieve camera current position
  m_cam.target_get_pivot(camobj, _cam_anim.current_target);
  m_trans.get_translation(camobj, _cam_anim.current_eye);

  // set camera starting position
  m_vec3.copy(_cam_anim.current_target, _cam_anim.starting_target);
  m_vec3.copy(_cam_anim.current_eye, _cam_anim.starting_eye);

  // set camera final position
  m_vec3.copy(pos_view, _cam_anim.final_eye);
  m_vec3.copy(pos_target, _cam_anim.final_target);

  // start animation
  _delta_target = ANIM_TIME;
  _cam_anim.timeline = m_time.get_timeline();
  console.log(_cam_anim)
}

function init_camera_animation(camobj) {

  var t_sensor = m_ctl.create_timeline_sensor();
  var e_sensor = m_ctl.create_elapsed_sensor();

  var logic_func = function(s) {
      // s[0] = m_time.get_timeline() (t_sensor value)
      return s[0] - _cam_anim.timeline < ANIM_TIME;
  }

  var cam_move_cb = function(camobj, id, pulse) {

      if (pulse == 1) {
          if (_anim_stop) {
              _cam_anim.timeline = -ANIM_TIME;
              return;
          }

          m_app.disable_camera_controls();

          // elapsed = frame time (e_sensor value)
          var elapsed = m_ctl.get_sensor_value(camobj, id, 1);
          var delta = elapsed / ANIM_TIME;

          m_vec3.subtract(_cam_anim.final_eye, _cam_anim.starting_eye, _vec3_tmp);
          m_vec3.scaleAndAdd(_cam_anim.current_eye, _vec3_tmp, delta, _cam_anim.current_eye);

          _delta_target -= elapsed;
          delta = 1 - _delta_target * _delta_target / (ANIM_TIME * ANIM_TIME);
          m_vec3.subtract(_cam_anim.final_target, _cam_anim.starting_target, _vec3_tmp);
          m_vec3.scaleAndAdd(_cam_anim.starting_target, _vec3_tmp, delta, _cam_anim.current_target);

          m_cam.target_set_trans_pivot(camobj, _cam_anim.current_eye, _cam_anim.current_target);

          console.log(_cam_anim.current_eye, _cam_anim.current_target)
      } else {
          m_app.enable_camera_controls(false, false, false, null, true);
          if (!_anim_stop)
              m_cam.target_set_trans_pivot(camobj, _cam_anim.final_eye, 
                      _cam_anim.final_target);
          else
              _anim_stop = false;
      }
  }

  m_ctl.create_sensor_manifold(camobj, "CAMERA_MOVE", m_ctl.CT_CONTINUOUS,
          [t_sensor, e_sensor], logic_func, cam_move_cb);
}

});

// import the app module and start the app by calling the init method
b4w.require("marinha").init();