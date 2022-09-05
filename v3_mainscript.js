document.getElementById("wpbody-content").style.opacity = 0.4;
document.getElementById("wpbody-content").style.pointerEvents = "none";

var kategoryList_html = [];
var kategoryListMatch = false;

//get value of list
var kategoryObjs = document.querySelectorAll("#categorychecklist li .selectit input")
var kategoryObjs_labels = document.querySelectorAll("#categorychecklist li .selectit")
//add to arary
for(var i = 0; i < kategoryObjs.length; i++){
	var kategoryObj = kategoryObjs[i];
  var kategoryObjs_label = kategoryObjs_labels[i];
  //add visual html
  kategoryList_html += `<option value="${kategoryObjs_label.innerText}">`;
}

var countEpObj = document.querySelector("#MySel");
countEpObj.innerHTML += `<option value="0">0</option>`;
for(var y = 101; y < 500; y++){
  countEpObj.innerHTML += `<option value="${y}">${y}</option>`;
}
populate(countEpObj,"MyTable");

document.body.innerHTML += `
<style>
.box1{
	position: fixed;
  bottom: 0px;
  right: 0px;
  width: 400px;
  height: 600px;
  background: #fff;
  border: 2px solid #000;
  max-width: 50vw;
  max-height: 100vh;
  z-index: 999999999999;
  overflow: auto;
  transition: .6s ease;
  padding: 10px;
  box-sizing: border-box;
}

.box1 textarea,
.box1 input{
	width: 95%;
  box-sizing: border-box;
  padding: 10px;
}
.box1 input[type=radio]{
  width: auto;
  padding: 1px;
}

.hiddenBox1{
	height: 60px;
  width: 130px;
}
</style>
<div class="box1">
	<div>
  	<a onclick="triggerBox1()">Show/Hide</a>
  </div>
	<p>SenpaiZero Masslinker</p>
  <br><br>
  <div>
    <p>Anime Name</p>
  	<input placeholder="Anime Name"
    id="fakeAnimeName"
    onkeyup="syncAnimeName()"
    onchange="syncAnimeName()"
    >
  </div>
   <div>
    <p>Folgen Beginn</p>
  	<input placeholder="Folgen Beginn"
    value="1"
    id="fakeep_offset"
    onkeyup="syncAnimeStartEpisode()"
    onchange="syncAnimeStartEpisode()"
    type="number">
  </div>
  <div>
    <p>Ger Sub oder Ger Dub</p>
    <input type="radio" name="subtype" value="sub" onclick="isSub()"> Ger Sub
    <input type="radio" name="subtype" value="dub" onclick="isDub()"> Ger Dub
  </div>
   <div>
   <p>Kategorie:</p>
  	<input placeholder="Kategorie" id="allKategories" list="kategorys"
    onkeyup="selectKategory(this.value)"
    onclick="selectKategory(this.value)"
    onchange="selectKategory(this.value)">
    <datalist id="kategorys">${kategoryList_html}</datalist>
  </div>
  <div>
    <p>Links</p>
  	<textarea id="MasslinkerTextRaw" placeholder="Jede Linie entspricht einer Episode. Mehrere Hoster mit Koma trenne."
    onkeyup="getLinks()"
    onchange="getLinks()"
    onclick="getLinks()"></textarea>
    <p>
      Supported Hoster:
      Doodstream
      Vivo
      PlayTube
      Streamtape
      SendFox
      GoUnlimited
      Mixdrop
    </p>
  </div>
  <div>
    <button onclick="submitMassPost()">SenpaiZeros Masslinker Starten</button>
  </div>
</div>
`;
var wpIsHidden = true;
let triggerBox1 = () => {
  document.querySelector(".box1").classList.toggle("hiddenBox1");
  if(window.wpIsHidden){
    window.wpIsHidden = false;
    document.getElementById("wpbody-content").style.opacity = 1;
    document.getElementById("wpbody-content").style.pointerEvents = "all";
  }else{
    window.wpIsHidden = true;
    document.getElementById("wpbody-content").style.opacity = 0.4;
    document.getElementById("wpbody-content").style.pointerEvents = "none";
  }
}

let unselectKategory = () => {
  window.kategoryListMatch = false;
  var kategoryObjs = document.querySelectorAll("#categorychecklist li .selectit input")
  for(var i = 0; i < kategoryObjs.length; i++){
    var kategoryObj = kategoryObjs[i];
    document.getElementById(kategoryObj.getAttribute("id")).checked = false;
  }
}

let selectKategory = (newSelected) => {
  //deselect old
  unselectKategory();

  setTimeout(()=>{
    //select new
    var kategoryObjs = document.querySelectorAll("#categorychecklist li .selectit input")
    var kategoryObjs_labels = document.querySelectorAll("#categorychecklist li .selectit")
    for(var i = 0; i < kategoryObjs.length; i++){
      var kategoryObj = kategoryObjs[i];
      var kategoryObjs_label = kategoryObjs_labels[i];
      //check if match
      if(newSelected === kategoryObjs_label.innerText){
        document.getElementById(kategoryObj.getAttribute("id")).click();
        window.kategoryListMatch = true;
      }
    }
  }, 10);
}

let submitMassPost = () => {
  document.getElementById("postformsubmit").click();
}

let selectCount = count => {
  document.querySelector("#MySel").selectedIndex = count;
  document.querySelector("#MySel").onchange();
}

let getNameFromLink = link => {
  if(link.includes("vivo")){
    return "Vivo";
  }else if(link.includes("dood")){
    return "Doodstream";
  }else if(link.includes("playtube")){
    return "PlayTube";
  }else if(link.includes("streamtape")){
    return "Streamtape";
  }else if(link.includes("sendfox")){
    return "SendFox";
  }else if(link.includes("gounlimited")){
    return "GoUnlimited";
  }else if(link.includes("mixdrop")){
    return "Mixdrop";
  }else {
    return "Unknow Player";
  }
}

let getLinks = () => {
  var MasslinkerTextRawObj = document.getElementById("MasslinkerTextRaw");
  var rawlinks = MasslinkerTextRawObj.value;
  var links = rawlinks.split(/\n/g);
  selectCount(links.length);

  var allInputs = document.querySelectorAll("#MyTable tr td textarea");
  for(var i = 0; i < allInputs.length; i++){
    var input = allInputs[i];

    var htmlOption = getHtmlForDropdown(links[i]);

    input.innerHTML = `<script src="https://cdn.jsdelivr.net/gh/Akamegakill-Dev/dropdown@main/v3/class.js"></script>
  <select class="vid_select">
      ${htmlOption}
  </select>
  <iframe src="" frameborder="0" id="videoFrame" allowfullscreen></iframe>
  <script src="https://cdn.jsdelivr.net/gh/Akamegakill-Dev/dropdown@main/script.js"></script>`;
  }
}

let syncAnimeName = () => {
  document.getElementById("anime-name").value = document.getElementById("fakeAnimeName").value;
}

let syncAnimeStartEpisode = () => {
  if(document.getElementById("fakeep_offset").value >= 1){
    document.getElementById("ep_offset").value = document.getElementById("fakeep_offset").value;
  }
}

let isSub = () => {
  document.querySelectorAll("#subdub")[1].checked = true;
  document.querySelectorAll("#subdub")[1].click();
}
let isDub = () => {
  document.querySelectorAll("#subdub")[2].checked = true;
  document.querySelectorAll("#subdub")[2].click();
}

let getHtmlForDropdown = links => {
  var linksArray = links.replace(/\s/g, '').split(/[,]{1}/g);
  var returnValue = "";
  var attribute = `data-preselect="select"`;
  for(var i = 0; i < linksArray.length; i++){
    if(linksArray[i] === ""){
      continue;
    }
    var playerName = getNameFromLink(linksArray[i]);
    returnValue += `<option value="${linksArray[i]}" ${attribute}>${playerName}</option>\n`;
    attribute = "";
  }
  return returnValue;
}
