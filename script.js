

function onStart(){
    //postClasses();
    for(var i in course_JSON){
        var courseTitle= course_JSON[i]["Department"] + course_JSON[i]["Course Number"] + " - " + course_JSON[i]["Section"];
        postToMenu(courseTitle);
    }

    //set up times
    timeList = ["8:30", "9:30", "10:30", "11:30", "12:30", "1:30", "2:30", "3:30", "4:30", "5:30", "6:30", "7:30", "8:30", "9:30" ];
    for(var i = 0; i<timeList.length; i++){
        var timeDiv = document.createElement("div");
        //set location on grid
        timeDiv.setAttribute("class", "timemark");
        var styleString = "grid-row: " + (i*12);
        timeDiv.setAttribute("style", styleString);
        var timeText = document.createTextNode(timeList[i]);
        timeDiv.appendChild(timeText);
        document.getElementById("schedule").appendChild(timeDiv);
    }

    //add horizontal lines
    for(var i = 1; i<14; i++){
        var lineDiv = document.createElement("div");
        lineDiv.setAttribute("class", "hline");
        var style = "grid-row: " + (i*12);
        lineDiv.setAttribute("style",style);
        document.getElementById("schedule").appendChild(lineDiv);
    }

    //add vertical lines
    for(var i = 3; i<8; i++){
        var lineDiv = document.createElement("div");
        lineDiv.setAttribute("class", "vline");
        var style = "grid-column: " + i;
        lineDiv.setAttribute("style",style);
        document.getElementById("schedule").appendChild(lineDiv);
    }
}

function searchFunction(){
    var input = document.getElementById("searchbar").value;

    //clear menu
    var i = 0;
    while(document.getElementById("menu").firstChild){
        document.getElementById("menu").removeChild(document.getElementById("menu").firstChild);
        i++;
    }
    //refill menu
    var found = false;
    for(var i in course_JSON){
        var courseTitle= course_JSON[i]["Department"] + course_JSON[i]["Course Number"];
        var section = course_JSON[i]["Section"];
        if(courseTitle==input.trim().toUpperCase()){
            found=true;
            postToMenu(courseTitle+" - "+section);
        }
        else if(input.toUpperCase() == course_JSON[i]["Department"].toUpperCase()){
            found=true;
            postToMenu(courseTitle+" - "+section);
        } 
    }

    if(found==false){
        //postClasses();
        for(var i in course_JSON){
            var courseTitle= course_JSON[i]["Department"] + course_JSON[i]["Course Number"] + " - " + course_JSON[i]["Section"];
            postToMenu(courseTitle);
    }
    }
}

function postCourse(courseTitle){
    var timesList = getTimeInfo(courseTitle);
    var colors = ['lightpink', 'lightsalmon', 'moccasin', 'lavender', 'darkseagreen', 'lightsteelblue', 'olive', 'thistle', 'lightsalmon'];
    var color = colors[Math.floor(Math.random()*colors.length)];
    for(time in timesList){
        var courseCard = setUpCard(courseTitle);
        setDayAndTime(courseCard, courseTitle, time);
        //courseCard.setAttribute("style", "color: "+hue);
        courseCard.style.backgroundColor = color;
        document.getElementById("schedule").appendChild(courseCard);
    }
}

function setDayAndTime(courseCard, courseTitle, day){
    //set day class
    setDay(day, courseCard);
    console.log(day);
    //set time with grid
    var timesList = getTimeInfo(courseTitle);
    var timeString = "grid-row: " + timesList[day][0] + " / " + timesList[day][1];
    courseCard.setAttribute("style", timeString);
}

function getTimeInfo(courseTitle){
    //dictionary with days for keys and start and end times for values
    var timesList = {};
    //for each time, add placements to its day of the week
    for(var i=0; i<course_JSON[courseTitle]["Times"].length; i++){
        var timeExp = course_JSON[courseTitle]["Times"][i];
        var day = timeExp.split("-")[0].trim();
        var start = timeExp.split("-")[1].trim();
        start = timeToPlacement(start);
        var end = timeExp.split("-")[2].trim();
        end = timeToPlacement(end);
        timesList[day] = [start, end];
    }
    return timesList;
    
}

function timeToPlacement(time){

    timenum=time.split(" ")[0];
    minutes = timenum.split(":")[0]*60 + parseFloat(timenum.split(":")[1]);
    if(time.split(" ")[1].trim()=='pm' && minutes < 720){
        minutes+=720;
    }
    //set start to 8:30
    minutes-=510;
    //convert to grid placement
    minutes = (minutes/5)+2;
    return minutes;
}

function postToDay(timeString, courseDiv){
    dayToken = getWeekDay(timeString);
    if(dayToken == 'M'){
        courseDiv.classList.add("monday");
    }
    if(dayToken== 'T'){
        courseDiv.classList.add("tuesday");
    }
    if(dayToken== 'W'){
        courseDiv.classList.add("wednesday");
    }
    if(dayToken== 'TH'){
        courseDiv.classList.add("thursday");
    }
    if(dayToken== 'F'){
        courseDiv.classList.add("friday");
    }
    document.getElementById("schedule").appendChild(courseDiv);
}

function setDay(dayToken, courseDiv){
    if(dayToken == 'M'){
        courseDiv.classList.add("monday");
    }
    if(dayToken== 'T'){
        courseDiv.classList.add("tuesday");
    }
    if(dayToken== 'W'){
        courseDiv.classList.add("wednesday");
    }
    if(dayToken== 'TH'){
        courseDiv.classList.add("thursday");
    }
    if(dayToken== 'F'){
        courseDiv.classList.add("friday");
    }
}

function unpostCourse(courseTitle){
    while(document.getElementById(courseTitle)){
        document.getElementById(courseTitle).remove();
    }
}

function postToMenu(courseTitle){
    var courseCard=setUpMenuCard(courseTitle);
    courseCard.addEventListener("click", function(){
        if(!document.getElementById(courseTitle)){
            postCourse(courseTitle);
        }
        else{
            unpostCourse(courseTitle);
        }
        //postCourse(courseTitle);
        //unpostCourse(courseTitle);
    });
    document.getElementById("menu").appendChild(courseCard);
}

function setUpCard(courseTitle){
    //set up course card
    var courseDiv = document.createElement("div");
    courseDiv.setAttribute('class', 'card');
    //add title line
    var title = course_JSON[courseTitle]["Title"]; 
    var titleNode = document.createTextNode(title);
    courseDiv.appendChild(titleNode);
    //add subtitle line
    var subtitle = ''; 
    subtitle += (course_JSON[courseTitle]['Department']); 
    subtitle += (course_JSON[courseTitle]['Course Number']); 
    subtitle += (' - ' + course_JSON[courseTitle]['Section']); 
    subtitle += (' ' + course_JSON[courseTitle]['Code']); 
    var subtitleNode = document.createTextNode(subtitle);
    var infoDiv = document.createElement("div");
    infoDiv.appendChild(subtitleNode);
    var br = document.createElement("br");
    infoDiv.appendChild(br);

    //add times
    for(var j = 0; j< course_JSON[courseTitle]['Times'].length; j++){
        //make element containing time
        infoDiv.setAttribute('class', 'time');
        var timeString = course_JSON[courseTitle]['Times'][j];
        var time = document.createTextNode(timeString);
        //add this time Info to courseDiv 
        //infoDiv.appendChild(time);
        courseDiv.appendChild(infoDiv);
    }
    courseDiv.setAttribute("id",courseTitle);

    //add removal functionality
    courseDiv.ondblclick = function(){
        unpostCourse(courseTitle);
    }
    return courseDiv;
}

function setUpMenuCard(courseTitle){
    //set up course card
    var infoDiv = document.createElement("div");
    infoDiv.setAttribute('class', 'menucard'); 
    //add title line
    var title = ''; 
    title += (course_JSON[courseTitle]['Department']); 
    title += (course_JSON[courseTitle]['Course Number']); 
    title += (' - ' + course_JSON[courseTitle]['Section']); 
    title += (' ' + course_JSON[courseTitle]['Code']); 
    var titleNode = document.createTextNode(title);
    infoDiv.appendChild(titleNode);
    //add times
    for(var j = 0; j< course_JSON[courseTitle]['Times'].length; j++){
        //make element containing time
        var timeDiv = document.createElement("div");
        timeDiv.setAttribute('class', 'menutime');
        var timeString = course_JSON[courseTitle]['Times'][j];
        var time = document.createTextNode(timeString);
        //add this time Info to courseDiv 
        timeDiv.appendChild(time);
        infoDiv.appendChild(timeDiv);
    }
    return infoDiv;
}

function getWeekDay(timeString){
    return timeString.split("-")[0];
}

function postClasses(){
    for(var i in course_JSON){
        var infoDiv = document.createElement("div");
        infoDiv.setAttribute('class', 'card'); 
        //add title line
        var title = ''; 
        title += (course_JSON[i]['Department']); 
        title += (course_JSON[i]['Course Number']); 
        title += (' - ' + course_JSON[i]['Section']); 
        title += (' ' + course_JSON[i]['Code']); 
        var titleNode = document.createTextNode(title);
        infoDiv.appendChild(titleNode);

        //add times
        
        for(var j = 0; j< course_JSON[i]['Times'].length; j++){
            //make element containing time
            var timeDiv = document.createElement("div");
            timeDiv.setAttribute('class', 'time');
            var timeString = course_JSON[i]['Times'][j];
            var time = document.createTextNode(timeString);
            //add this time Info to courseDiv 
            timeDiv.appendChild(time);
            infoDiv.appendChild(timeDiv);
        }

        for(var j = 0; j< course_JSON[i]['Times'].length; j++){
            var timeString = course_JSON[i]['Times'][j];
            postToDay(timeString, infoDiv);
        }
        
    }
}
