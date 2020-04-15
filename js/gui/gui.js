export default class GUI {
    constructor(){
        this.body = document.getElementsByTagName("body")[0];
        this.id_list = [];
    }

    getIdList(){
        return this.id_list;
    }

    menu(){
        this.menuContainer = document.createElement("div");
        this.menuContainer.id = "menu";
        this.menuContainer.classList.add("menuContainer");
        this.body.appendChild(this.menuContainer);
    }

    title(_title, _subtitle=false){
        let title = document.createElement("div");
        if(_subtitle) title.classList.add("subtitle");
        else title.classList.add("title");
        title.textContent = _title;
        this.menuContainer.appendChild(title);
    }

    button(id, _text, _value){
        let button = document.createElement("button");
        button.id = id;
        this.id_list.push(button.id);
        button.value = _value;
        button.textContent = _text;
        if(_value !== 0) button.classList.add("selected");
        button.onclick = function(){
            if(this.id !== "reset") this.classList.toggle("selected");
            this.value++;
        }
        this.menuContainer.appendChild(button);
    }

    slider(id, _min, _max, _val, _step){
        let sliderContainer = document.createElement("div");
        let slider = document.createElement("input");
        slider.id = String(id);
        this.id_list.push(slider.id);
        slider.classList.add("slider");
        slider.type = "range";
        slider.min = _min;
        slider.max = _max;
        slider.value = _val;
        slider.step = _step;
        this.menuContainer.appendChild(slider);
    }

    input(){
        let input = document.createElement("input");
        input.classList.add("input");
        input.type = "text";
        input.value = 0;
        this.menuContainer.appendChild(input);
    }

    dropdown(id, args){
        let dropdown = document.createElement("select");
        dropdown.id = String(id);
        this.id_list.push(dropdown.id);
        // dropdown.classList.add(
        for(let i=0; i<args.length; i++){
            let option = document.createElement("option");
            option.textContent = args[i];
            // option.value = this.cleanArg(args[i]);
            if(!i) option.selected = "selected";
            dropdown.appendChild(option);
        }
        this.menuContainer.appendChild(dropdown);
    }

    mobile(_message){
        let mobile = document.createElement("div");
        mobile.classList.add("mobile");
        let text = document.createElement("P");
        text.textContent = String(_message);
        mobile.appendChild(text);
        this.body.appendChild(mobile);
    }

    about(id, _text, _value, _messages){
        let button = document.createElement("button");
        button.id = id;
        this.id_list.push(button.id);
        button.value = _value;
        button.textContent = _text;

        let message = document.createElement("div");
        message.id = "aboutBox";
        message.classList.add("about");
        message.classList.add("hide");
        for(let m of _messages){
            let text = document.createElement("P");
            text.textContent = String(m);
            message.appendChild(text);
        }

        let link1 = document.createElement("div");
        link1.classList.add("aboutLink");
        let githubLink = document.createElement("a");
        let githubLinklinkText = document.createTextNode("Github");
        githubLink.appendChild(githubLinklinkText);
        githubLink.title = "github";
        githubLink.href = "http://www.github.com/joshmurr/js_3d_engine/";
        link1.appendChild(githubLink);
        message.appendChild(link1);

        let link2 = document.createElement("div");
        link2.classList.add("aboutLink");
        let joshWebsite = document.createElement("a");
        let joshWebsitelinkText = document.createTextNode("Made by Josh Murr");
        joshWebsite.appendChild(joshWebsitelinkText);
        joshWebsite.title = "joshmurr";
        joshWebsite.href = "http://www.joshmurr.com/";
        link2.appendChild(joshWebsite);
        message.appendChild(link2);

        if(_value !== 0) {
            button.classList.add("selected");
            message.classList.toggle("hide", false);
            message.classList.toggle("show", true);
        } 
        button.onclick = function(){
            if(this.id !== "reset") this.classList.toggle("selected");
            if(this.id == "about") {
                document.getElementById("aboutBox").classList.toggle("hide");
                document.getElementById("aboutBox").classList.toggle("show");
            }
            this.value++;
        }


        this.menuContainer.appendChild(button);
        this.body.appendChild(message);
    }

    cleanArg(_arg){
        return _arg.toLowerCase().replace(/ /g,'');
    }

}
