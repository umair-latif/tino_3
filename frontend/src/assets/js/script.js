 //Apply the saved theme settings:
 //****************************** */
function applySavedSettings(){
   if(window.localStorage && localStorage.getItem('themeSettings')){
        //Set theme:
        // if(localStorage.getItem('themeSettings')) {
        const themeSettings = JSON.parse(localStorage.getItem('themeSettings'));
        // console.log(themeSettings['darkMode']);
        
        if(themeSettings['darkMode'])
            document.body.classList.add('dark-mode');
        else
            document.body.classList.remove('dark-mode');
        document.getElementById('themeToggle').checked = themeSettings['darkMode'];
        
        //set menu width
        if(themeSettings['menuWidth'] === 'narrow'){
            const menu = document.querySelector('.menu-container');
            menu.classList.add('narrow');
           
        }
        else document.querySelector('.menu-container').classList.remove('narrow');
        setMenuWidth();

        //set time format:
        if(themeSettings['timeFormat'] === '24h'){
           if(document.querySelector('#timeFormat')) {
            document.querySelector('#timeFormat').checked = true;
           }
        }

        //set date fromat:
        if(document.querySelector('#dateFormat')) {
            document.querySelector('#dateFormat').value = themeSettings['dateFormat'];
        }

        //set layout:
        if(document.querySelector('#layout')) {
            document.querySelector('#layout').value = themeSettings['layout'];
        }


   }
}
applySavedSettings();

// Footer Time and Date
//****************************** */
function updateFooterTimeDate() {
    const now = new Date();
    let dateTime;
    if(window.localStorage && localStorage.getItem('themeSettings')){
        const settings = JSON.parse(localStorage.getItem('themeSettings'));
        
        if(settings['dateFormat'] === 'long'){
            dateTime = now.toLocaleDateString('en-US',{
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            }) + ' | ';
        }
        else dateTime = now.toLocaleDateString() + ' | ';
        if(settings['timeFormat'] === '12h'){
            dateTime = dateTime + now.toLocaleTimeString('en-US');
        }
        else dateTime = dateTime + now.toLocaleTimeString();
        
    }

    document.getElementById('timeDate').textContent = dateTime;
}
setInterval(updateFooterTimeDate, 1000);
updateFooterTimeDate();

// //Header scroll effect:
// //****************************** */
// window.addEventListener("scroll", function() {
//     let header = document.getElementById("header");
//     if (window.scrollY > 10) {
//         header.classList.add("shadow");
//     } else {
//         header.classList.remove("shadow");
//     }
// });

// Theme Toggle
//****************************** */
document.getElementById('themeToggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    if(document.body.classList.contains('dark-mode'))
        saveThemeSettings('darkMode', true);
    else
        saveThemeSettings('darkMode', false);
});

// Submenu Toggle
//****************************** */
function toggleSubMenu(element) {
    const allSubMenus = document.querySelectorAll('.sub-menu');
    allSubMenus.forEach(menu => {
        if (menu !== element.querySelector('.sub-menu')) {
            menu.classList.remove('active');
        }
    });
    document.querySelector('.sub-menu').classList.toggle('active');
}

// Toggle Hamburger Menu
//****************************** */
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.menu-container').classList.toggle('active');
});

// Click Outside to Close Menu
//****************************** */
document.addEventListener('click', function(event) {
    const menu = document.querySelector('.menu-container');
    const hamburger = document.querySelector('.hamburger');
    
    if (!menu.contains(event.target) && 
        !hamburger.contains(event.target) &&
        !event.target.closest('.sub-menu')) {
        menu.classList.remove('active');
    }
});

// Toggle Menu Width
//****************************** */
function toggleMenuWidth() {
    const menu = document.querySelector('.menu-container');   
    
    menu.classList.toggle('narrow');
    if(menu.classList.contains('narrow')) {
        saveThemeSettings('menuWidth', 'narrow');
    }
    else{
        saveThemeSettings('menuWidth', '');
    }
    setMenuWidth();
}

//Set menu width
//****************************** */
function setMenuWidth(){
    const menu = document.querySelector('.menu-container');
    const text = document.querySelectorAll('.menu-text');
    if(menu.classList.contains('narrow')) {
        for(let i=0; i<text.length; i++){
            text[i].classList.add('hide');
        } 
        menu.style.width = '80px';
    } else {
       menu.style.width = '200px';
        setTimeout(function() {
            for(let i=0; i<text.length; i++){
                text[i].classList.remove('hide');
            }
          }, 200);
          
    }
    var x = window.matchMedia("(max-width: 480px)");
    adjustContentWidth(x);
}

// Attach event listener on x-state changes for mobile screens
var x = window.matchMedia("(max-width: 480px)");
x.addEventListener("change", function() {
    adjustContentWidth(x);
  });

// Adjust content width
//****************************** */
function adjustContentWidth(x){
    const content = document.querySelector(".main-content");
    const menu = document.querySelector('.menu-container');
    if(x.matches) content.style.marginLeft = '0px';

    else if(menu.classList.contains('narrow')) {        
        content.style.marginLeft = '80px';
    } else {
       content.style.marginLeft = '200px';
    }  
}

//Save theme settings to local storage
//****************************** */
function saveThemeSettings(setting, value){
    if(window.localStorage){
        let themeSettings = {
            darkMode: false,
            menuWidth: 'narrow',
            timeFormat: '24h',
            dateFormat: 'short',
            displayWeather: false,
            layout: 'grid'
        };

        if(localStorage.getItem("themeSettings")){
            themeSettings = JSON.parse(localStorage.getItem("themeSettings"));
        }
        themeSettings[setting] = value;
        localStorage.setItem("themeSettings", JSON.stringify(themeSettings));
    }
}