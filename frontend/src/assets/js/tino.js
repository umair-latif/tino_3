//Adjust height of the input textarea as typed:
//****************************** */
function adjustHeight($textarea) {
    // console.log($textarea);
    
    // const lineHeight = parseInt(textarea.css('line-height'));
    const minHeight = parseInt($textarea.css('min-height'));
    $textarea.height('auto');
    const scrollHeight = $textarea.prop('scrollHeight');
    const newHeight = Math.max(scrollHeight);
    $textarea.height(scrollHeight);
}

//Function for adding note on button click
//****************************** */
function addNote(){
    const usertext = $("#new-text").val();
    if(usertext == ""){
        alert("write something!");
        $("#new-text").focus();
        return;
    }

    // create note object
    const date = new Date().toLocaleDateString();
    const selectedCat = "Work";
    const color = "";
    const pinned = false;

    let noteData = {
        id: getTimeStamp(),     // Unique identifier for each note (Timestamp: 20231015120000)
        date: date,             // Date stamp for when the note was created/updated
        text: usertext,         // Content of the note
        cat: selectedCat,       // Category of the note
        color: color,           // Background color of the note
        pinned: pinned,         // Whether the note is pinned
        tags: [""]              // Optional tags for filtering ["urgent", "important"]
    }
    createNote(noteData); //add new note to the notesArea
    addNoteToStorage(noteData); //addItem to the storage
}

//Creating a note from html-template and appending to notesArea
//noteData: note object
//****************************** */
function createNote(noteData){
    const template = $("template#note-template").clone(true);
    const newNote = $(template.prop("content")).children('div').first();
    const textarea = $(newNote).children('.note-text');
    
    textarea.val(noteData.text);
    textarea.attr('disabled', true);
    
    //add note.id to the note-header as id to identify for events:
    $(newNote).children('.note-header').prop('id', noteData.id);
    $(newNote).children('.note-header').children('.date').text(noteData.date);
    
    //attach event handlers to btns:
    $(newNote).children('.note-header').children('.edit-btn').on('click', function(){
        editBtn_click(this); 
        return false;
    });
    $(newNote).children('.note-header').children('.save-btn').on('click', function(){
        saveBtn_click(this);
        return false;
    });
    $(newNote).children('.note-header').children('.del-btn').on('click', function(){
        $(this).parent().parent().remove();
        const id = $(this).parent().prop('id');
        if(id) deleteNote(id);
        return false;
    });
    //show resize btn only if grid and column number is 2+:
    if((JSON.parse(localStorage.getItem('themeSettings'))['layout'] === 'grid') && (getGridColumns() > 1)){
        let isExpanded = false;
        $(newNote).children('.note-header').children('.size-btn').on('click', function(){
        $(newNote).toggleClass('expand-note');
        isExpanded = !isExpanded;        
        if(isExpanded)
            $(this).removeClass('bi-arrows-angle-expand').addClass('bi-arrows-angle-contract');
        else
            $(this).removeClass('bi-arrows-angle-contract').addClass('bi-arrows-angle-expand');
        return false;
        });
    }
    else{
        $(newNote).children('.note-header').children('.size-btn').hide();
    }
    
    //event handler for textarea to adjust height:
    textarea.on("keydown", function (e) {
        if (e.key === "Enter") {
            adjustHeight(textarea);
            setRowSpan($(newNote));
        }
      });
    //  textarea.on('input', function(){
    //     adjustHeight(textarea);
    //     setRowSpan($(newNote)); 
    //  })

    //apply background color if any:
     if(noteData.color != ""){
        newNote.css('background-color', noteData.color);
     }
    
    //Append the note to the notes area and then adjust the height:
    let notesArea = $("#notes-area");    
    $(newNote).prependTo(notesArea);

    //adjust the height of the textarea:
    const minHeight = parseInt(textarea.css('min-height'));
    textarea.height(0);
    const scrollHeight = textarea.prop('scrollHeight');
    const newHeight = Math.max(scrollHeight, minHeight);
    textarea.height(newHeight);
    setRowSpan($(newNote));
}

//Function to calculate and set the row span for created note
function setRowSpan($note) {
    const baseRowHeight = 32;
    // Get the height of the note (including padding, border, etc.)
    // const noteHeight = $note.outerHeight(true);
    const noteHeight = $note.children('textarea').prop('scrollHeight');
    const noteMinH = parseInt($note.css('min-height'));

    // Calculate how many rows this note should span
    const rowSpan = Math.floor((noteHeight)/ baseRowHeight);

    // Set the --row-span CSS variable
    $note.css('--row-span',  Math.max(rowSpan, 4));
}

//Function for rearranging the notes after sort or filter, etc:
//****************************** */
// function rearrangeAllNotes(){
//     // Loop through each note and set its row span initially
//     // console.log( "rearranged all: ", $(notesArea).children('.note'));
    
//     $(notesArea).children('.note').each(function () {
//         setRowSpan($(this));
//     });
// }

/**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**++++++++++++++++++ localStorage functions ++++++++++++++++++++++ */
function getTimeStamp(){
    var Jetzt = new Date();
        
    var Tag = Jetzt.getDate();
    var Monat = Jetzt.getMonth() + 1;
    var Jahr = Jetzt.getFullYear();

    var Stunden = Jetzt.getHours();
    var Minuten = Jetzt.getMinutes();
    var Sekunden = Jetzt.getSeconds();

    var Vortag = (Tag < 10) ? "0" : "";
    var Vormon = (Monat < 10) ? "0" : "";
    var Vorstd = (Stunden < 10) ? "0" : "";
    var Vormin = (Minuten < 10) ? "0" : "";
    var Vorsek = (Sekunden < 10) ? "0" : "";

    var timestamp = Jahr + Vormon + Monat + Vortag +Tag + Vorstd + Stunden +Vormin + Minuten + Vorsek + Sekunden;
    return(timestamp);
}

//push new noteData to the storage:
function addNoteToStorage(note) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
}

//get all notes from storage and create in DOM:
function getAllNotes(){ 
  //set the layout:
  console.log(JSON.parse(localStorage.getItem('themeSettings')));
  
  if(JSON.parse(localStorage.getItem('themeSettings'))['layout'] === 'grid'){
        $('#notes-area').addClass('grid-view').removeClass('list-view');
    }else{
        $('#notes-area').addClass('list-view').removeClass('grid-view');
    }

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.sort((a, b) => new Date(a.date) - new Date(b.date));
    for(let i=0; i<notes.length ; i++){
       if(notes[i]) createNote(notes[i]);
    }
}

//delete a note with =id:
function deleteNote(id){
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const filteredNotes = notes.filter((note) => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(filteredNotes));
}

function deleteAllData(){
    const result = confirm("You are about to delete all the notes in the storage. \nAre you sure you want to proceed?");
    if (result) {
       localStorage.removeItem("notes");
    }
}

function downloadAllData(){
    const notes = localStorage.getItem("notes");
    const result = confirm("The stored data will be downloaded as a JSON-file. \nAre you sure you want to proceed?");

    if (notes && result) {
    // Convert notes string to a Blob object
    const blob = new Blob([notes], { type: "application/json" });

    // Create a download link
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tino_notes.json";
    // Append the link, trigger download, and remove the link
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    }
}

//update note data
//id: id of the edited note   updatedText: content of the textarea
function updateNote(id, updatedText) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const index = notes.findIndex((note) => note.id === id);
    if (index !== -1) {
        notes[index].text = updatedText;
        notes[index].date = new Date().toLocaleDateString(); //update the date
        localStorage.setItem("notes", JSON.stringify(notes));
    }
    //reload the notes in notesArea
    loadNotes();
}

//make the textarea active for editing, toggle btns
function editBtn_click(btn){
    const noteheader = $(btn).parent();
    const noteText = noteheader.siblings('.note-text');
    noteText.attr('disabled', false).removeClass('inactive-text');
    noteheader.parent().addClass('active-note');
    noteheader.children('.edit-btn').toggleClass('inactive-link');
    noteheader.children('.save-btn').toggleClass('inactive-link');
}

//call update note to save the data and refresh
function saveBtn_click(btn){
    const noteheader = $(btn).parent();
    const noteText = noteheader.siblings('.note-text');
    noteText.attr('disabled', true).addClass('inactive-text');
    noteheader.parent().removeClass('active-note');
    noteheader.children('.save-btn').toggleClass('inactive-link');
    noteheader.children('.edit-btn').toggleClass('inactive-link');
    updateNote(noteheader.prop('id'), noteText.val());
}

//Get the used localStorage space:
//****************************** */
function getUsedLocalStorageSpace() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length;
        }
    }
    return parseFloat(total/1024).toFixed(2);
}

const usedStorage = getUsedLocalStorageSpace();
console.log(`LocalStorage used: ${usedStorage} KB`);

/**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**++++++++++++++++ SETTINGS ++++++++++++++++++++++++++++++++++++ */

//Settings page is loaded dynamically.
//Function to attach events to the elemnets after loading
function attachEventsToSettings(){
    $('#timeFormat').on('change', function(){  
       if($('#timeFormat')[0].checked)    
            saveThemeSettings('timeFormat', '24h');
        else
            saveThemeSettings('timeFormat', '12h');
    });

    $('#dateFormat').on('click', function(){  
        if($('#dateFormat').val())    
             saveThemeSettings('dateFormat', $('#dateFormat').val());
     });

    $('#layout').on('click', function(){  
        if($('#layout').val())    
            saveThemeSettings('layout', $('#layout').val());
    });
    const usedStorage = getUsedLocalStorageSpace();
    $('#usedLocalStorage').text('LocalStorage used: '+ String(usedStorage) + ' KB');
    //apply the settings:
    applySavedSettings();
}

/**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**++++++++++++++++ AJAX ++++++++++++++++++++++++++++++++++++++++ */

//When document is ready...
$(document).ready(function () {

    //get the last visited page from sessionStorage:
    let lastvisited = 'notes'; //default is 'notes'
    if(window.sessionStorage){
        lastvisited = sessionStorage.getItem('nav');
    }
    loadPage(lastvisited); //call load with last visited page

    //attache events to menu items:
   const settingsBtn = $('#settings');
   const notesBtn = $('#notes');
   settingsBtn.on('click', function (e) {
        loadPage('settings');
        //Add a history entry:
        const hyperRef = '#settings';
        const linkContent = this.textContent.trim();
        history.pushState(
            {pageName: 'settings'},   //state obj
            linkContent,        //page title
            hyperRef            //URL
        );
        return false; //prevent the standard behaviour
    });
    notesBtn.on('click', function (e) {
        loadPage('notes');
        const hyperRef = '#notes';
        const linkContent = this.textContent.trim();
        history.pushState(
            {pageName: 'notes'},   //state obj
            linkContent,        //page title
            hyperRef            //URL
        );
        return false; //prevent the standard behaviour
    });
})
//when navigation is used, load the page:
window.addEventListener("popstate", function(event){
    console.log(event.state, event.state.pageName);
    if(event.state) loadPage(event.state.pageName);
    else loadPage("notes");
});

//call to load page contents:
function loadPage(pageName){
    
    switch (pageName) {
        case 'settings':
            loadSettings();
            break;
        case 'notes':
            loadNotes();
            break;
        default:
            loadNotes();
            break;
    }
}

//****************************** */
//load settings:
const loadSettings = function(){
    $('.main-content').load("./settings.html", 
    function(response, status, xhr){ 
        if(xhr.status != 200){
            $('.main-content').text("load() error: ", status);
            return;
        }
        attachEventsToSettings();
        saveNav('settings');        
    });
}

//load notes:
const loadNotes = function(){
    $('.main-content').load("./notes.html", 
    function(response, status, xhr){ 
        if(xhr.status != 200){
            $('.main-content').text("load() error: ", status);
            return;
        }
        
        //Get saved notes from the local storage:
        getAllNotes();
        saveNav('notes');
        //resize the new note textarea on typing:
        $('#new-text').on('input',function(){
            adjustHeight($('#new-text'));
         });

        //Special function for hiding resize buttons on the notes when the screen is too small.
        //prevents unexpected behaviour.

        //Run function on window resize to get the number of columns in the grid
        window.addEventListener("resize", () => {
        //    console.log(getGridColumns());
            
            //when 1 column, hide the resize button and restore normal size
            if(getGridColumns() <= 1){
                $('.size-btn').hide();
                $('.note').removeClass('expand-note');
            }
            else $('.size-btn').show();
        });
    });
}
function getGridColumns() {
    let grid = document.querySelector("#notes-area"); // Your grid container
    if (!grid) return 0;

    let gridWidth = grid.clientWidth; // Get total width of grid
    let columnWidth = 300; // 18.75rem in pixels (assuming 1rem = 16px)
    let gap = parseFloat(getComputedStyle(grid).gap) || 0; // Get gap size

    return Math.floor(gridWidth / (columnWidth + gap)); // Calculate columns
}

/**++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/**++++++++++++++++ SESSION STORAGE +++++++++++++++++++++++++++++ */

//save currrent page name in session storage:
const saveNav = function(pageName){
    // console.log($('.menu-item').removeClass('selected').find('#'+pageName));
    $('.menu-item').removeClass('selected');
    $('#'+pageName).addClass('selected');
    // if($('#'+pageName)){
    //     $('#'+pageName).addClass('selected');
    // }

    if(window.sessionStorage){
        sessionStorage.setItem('nav', pageName);
    }
}