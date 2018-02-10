function peopleList(options) {

    var parent = document.getElementById('people-list');

    var peoples = [];

    var addButton = document.getElementById(options.addButton);

    function addPeople() {

        addPeople: while (true){
            var peoplesCount = peoples.length  >0  ? " Added "+peoples.length+" names." : '';

            var name = prompt("Write the name." + peoplesCount , '');

            if(peoples.length < 7) {

                if(!name || name === false){
                    var conf = confirm("The number of people should be more than seven. Added "+peoples.length+" names. Continue adding a new names?");
                    if(conf){
                        continue addPeople;
                    }else {
                        peoples.length = 0;
                        return false;
                    }
                }
            }else {
                if(!name || name === false) return true;
            }

            peoples.push(name);
        }

        return true;
    }

    //if Add people buttun has not been found return
    if(addButton === undefined) return;

    // click to "Add people" button
    addButton.onclick = function () {

        if(peoples.length >= 7){
            addNewPeople();
        }else {
            createList();
        }
    };

    //Creates list of people
    function createList() {

        if(parent.childNodes.length > 0) return;
        if(!addPeople())return;

        var ul = document.createElement('ul');
        ul.setAttribute('id','people-ul');

        parent.appendChild(ul);
        peoples.forEach(function (people) {
            appendPeople(people,ul);
        });
    }

    //Adds a new name, if the list has been created
    function addNewPeople() {
        var ul = document.getElementById('people-ul');
        if(!ul) return;

        var name = prompt("Enter name", '');
        if(!name || name === false) return;
        appendPeople(name,ul);
    }

    //Append people li to ul
    function appendPeople(people,ul) {
        var li = document.createElement('li');

        var pCell = document.createElement('div');

        pCell.style.backgroundColor = addRandomColor();

        ul.appendChild(li);
        var libox = li.getBoundingClientRect();
        pCell.style.position = 'absolute';

        pCell.style.width = libox.width +'px';
        pCell.style.height = libox.height+'px';

        li.appendChild(pCell);

        pCell.setAttribute('class','people');

        pCell.innerHTML = people;
    }

    //adding random colors to people items background
    function addRandomColor(rand) {
        return '#'+randomColor().toString(16)+randomColor().toString(16)+randomColor().toString(16);
    }

    //generating color
    function randomColor() {
        return Math.ceil(255 - Math.random() * 150);
    }
    // swap people names
    //============================================================

    document.onmousedown = function (e) {
        if(peoples.length < 7 ) return;

        //Return if the right button of the mouse is not pressed.
        if(e.which !== 1) return;

        var elem = e.target.closest('.people');

        //Return, if the element has not been found.
        if(!elem) return;

        var avatar = createAvatar();

        var pos = getPosition(avatar);

        moveAt(e);


        document.onmousemove = function (e) {
            moveAt(e);
        };


        document.onmouseup = function (e) {
            document.onmousemove = null;
            var target = drop(e);
            if(target === null){
                rollback();
            }else {

                swapElements(elem, target);

                avatar.offsetParent.removeChild(avatar);
            }
        };


        function swapElements(obj1, obj2) {

            var temp = document.createElement("div");
            obj1.parentNode.insertBefore(temp, obj1);

            obj2.parentNode.insertBefore(obj1, obj2);

            temp.parentNode.insertBefore(obj2, temp);

            temp.parentNode.removeChild(temp);
        }

        //Moves the object
        function moveAt(e) {
            avatar.style.left = e.pageX - pos.x-avatar.offsetWidth/2 + 'px';
            avatar.style.top = e.pageY - pos.y-avatar.offsetHeight + 'px';
        }

        //Returns the object to its initial
        function rollback(e) {

            avatar.style.left = avatar.offsetLeft + 'px';
            avatar.style.top = avatar.offsetTop +'px';

            elem.offsetParent.removeChild(avatar);


        }

        //Finds the target object
        function drop(e) {
            var box = avatar.getBoundingClientRect();
            avatar.style.display = 'none';

            var elWPos = box.left;

            var dropEl = document.elementFromPoint(elWPos = e.clientX >= box.left ? box.width : box.left, e.clientY);

            avatar.style.display = 'block';

            if(dropEl === null)
                return null;

            return dropEl.closest('.people');
        }

        //Finds elements position
        function getPosition(elem) {
            var xPos = 0;
            var yPos = 0;
            while (elem){
                xPos += (elem.offsetLeft - elem.scrollLeft + elem.clientLeft);
                yPos += (elem.offsetTop - elem.scrollTop + elem.clientTop);
                elem = elem.offsetParent;
            }
            return { x:xPos, y:yPos};
        }

        //When the given name is pressed it creates similar temporary object
        function createAvatar() {
            var avatar = elem.cloneNode(true);
            avatar.setAttribute('id','id-avatar');

            //Return, if the avatar has already been found
            if(document.getElementById('id-avatar'))return;

            avatar.classList.remove('people');
            avatar.classList.add('avatar');
            avatar.style.position = 'absolute';
            avatar.style.zIndex = 9999;
            elem.offsetParent.appendChild(avatar);

            return avatar;
        }
    };

}
