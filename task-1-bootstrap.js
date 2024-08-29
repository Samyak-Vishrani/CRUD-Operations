
const apiUrl = "https://dummyjson.com/posts";
var apiArr = [];
var rowsNo;
var x = 0;



// ALERTS

const alerts = (msg, className) => {

    const div = document.createElement("div");
    div.className = `alert alert-${className}`;

    div.appendChild(document.createTextNode(msg));

    const container = document.querySelector(".container");
    const main = document.querySelector(".main");
    container.insertBefore(div, main);

    setTimeout( () => {
        $(".alert").remove()
    }, 2500);

}


// BUTTON EVENT LISTENER

$( "#postTable tbody" ).on( "click", "button", async (event) => {

    var btn_clicked = event.target;
    var row_id = btn_clicked.parentElement.parentElement.id;
    
    row_id = row_id.substring(7);       // Remove 'postId_' from the ID to get ID of post

    if(btn_clicked.classList.contains("delete")){
        
        deleteFunc(row_id);
        
        btn_clicked.parentElement.parentElement.remove();
        alerts("Post Deleted!!", "danger");
        
        x--;

    }

    else if(btn_clicked.classList.contains("info")){
        const response = await fetch(apiUrl + `/${row_id}`);
        const data = await response.json();
        
        openInfoModal();

        $(".info-card-title").text(data.title);
        $(".info-card-text").text(data.body);
        $(".info-card-tags").text("Tags: " + data.tags);
        $(".info-card-views").text(data.views);
        $(".info-card-likes").text(data.reactions.likes);
        $(".info-card-dislikes").text(data.reactions.dislikes);
        
        $("#close-info-button").on("click", ()=>{
            closeInfoModal();
        })
    }

    else if(btn_clicked.classList.contains("edit")){
        await openEditModal(row_id);

        $(".save-edit").on("click", async (e)=>{
            
            const editObj = {
                title: $(".edit-card-title").val(),
                body: $(".edit-card-text").val(),
                tags: $(".edit-tag-text").val()
            }
            
            const response = await fetch(apiUrl + `/${row_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editObj),
            });
            const data = await response.json();
            var editTitle = $(".edit-card-title").val();
            
            var getRow = document.getElementById("postId_" + row_id);
            getRow.firstElementChild.innerHTML = `${editTitle}`;
            
            closeEditModal();
        })

        $("#close-edit-button").on("click", ()=>{
            closeEditModal();
        })
        
    }

});



// MORE INFO MODAL

function openInfoModal() {
    var backdrop = document. querySelector('.backdrop') ;
    var modal = document.querySelector('#info-modal') ;

    backdrop.style.display = "block";
    modal.style.display = "block";
}
function closeInfoModal() {
    var backdrop = document. querySelector('.backdrop') ;
    var modal = document.querySelector('#info-modal') ;

    backdrop.style.display = "none";
    modal.style.display = "none";
}



// EDIT POST MODAL

async function openEditModal(id) {
    var backdrop = document. querySelector('.backdrop');
    var edit_modal = document.querySelector('#edit-modal');

    const response = await fetch(apiUrl + `/${id}`);
    const dataEdit = await response.json();

    $(".edit-card-title").text(dataEdit.title);
    $(".edit-card-text").text(dataEdit.body);
    $(".edit-tag-text").text(dataEdit.tags);

    backdrop.style.display = "block";
    edit_modal.style.display = "block";
}
function closeEditModal() {
    var backdrop = document. querySelector('.backdrop');
    var edit_modal = document.querySelector('#edit-modal');

    backdrop.style.display = "none";
    edit_modal.style.display = "none";
}



// DELETE FUNCTION

const deleteFunc = async (id) => {
    const response = await fetch(apiUrl + `/${id}`, {
        method: 'DELETE',
    });

    const data = await response.json();
}



// CLEAR ALL
$(".clearButton").on("click", async (event) => {
    
    var btn_click = $("#postTable tbody tr");
    for(i=0; i<=x; i++){
        btn_click.remove();
    }
    x=0;
    alerts("Clear All !!", "success");
    
});



// GET DATA
$(".search").on("click", (e) => {

    var idVal = idValue(e);
    var tagVal = tagValue(e);
    getPostByUserId(idVal);
    getPostByTag(tagVal);

});

const idValue = (e) => {
    e.preventDefault();

    var idVal = document.getElementById("get-id").value;
    return idVal;
}
const tagValue = (e) => {
    e.preventDefault();

    var tagVal = document.getElementById("get-tag").value;
    return tagVal;
}



//  GET POSTS

const getPostByUserId = async (id) => {
    const response = await fetch(apiUrl + `/user/${id}`);
    const data = await response.json();

    var noOfPosts = data.posts.length;
    for(i=0; i<noOfPosts; i++){
        var postTitle = data.posts[i].title;
        var postViews = data.posts[i].views;
        var postId = data.posts[i].id;

        apiArr[i] = data.posts[i];
        x++;
        
        const list = document.querySelector(".post-list");
        const addRow = document.createElement("tr");
        addRow.id = "postId_" + postId;
    
        addRow.innerHTML = `
    
        <td>${postTitle}</td>
        <td>${postViews}</td>
        <td>
            <button class="btn btn-secondary btn-sm info">More Info</button>
            <button href="task-1_update.html" target="_blank" class="btn btn-warning btn-sm px-3 edit">Edit</button>
            <button class="btn btn-danger btn-sm px-2 delete">Delete</button>
        </td>
        `;

            
        list.appendChild(addRow);
    }

    alerts("Post Added!!", "success");

    
}

const getPostByTag = async (tag) => {
    const response = await fetch(apiUrl + `/tag/${tag}?limit=100`);
    const data = await response.json();

    const noOfPosts = data.posts.length;
    for(i=0; i<noOfPosts; i++){
        var postTitle = data.posts[i].title; 
        var postViews = data.posts[i].views; 
        
        const list = document.querySelector(".post-list");
        const addRow = document.createElement("tr");
        x++;
    
        addRow.innerHTML = `
    
        <td>${postTitle}</td>
        <td>${postViews}</td>
        <td>
            <button class="btn btn-secondary btn-sm info">More Info</button>
            <button href="task-1_update.html" target="_blank" class="btn btn-warning btn-sm px-3 edit">Edit</button>
            <button class="btn btn-danger btn-sm px-2 delete">Delete</button>
        </td>
        `;
        
        list.appendChild(addRow);
    }

    alerts("Post Added!!", "success");

}



// ADD POSTS

var getUserIdValue = (e) => {
    e.preventDefault();
    
    var getUserIdVal = document.getElementById("getUserId").value;
    return getUserIdVal;
}
var getTitleValue = (e) => {
    e.preventDefault();
    
    var getTitleVal = document.getElementById("getTitle").value;
    return getTitleVal;
}
var getBodyValue = (e) => {
    e.preventDefault();
    
    var getBodyVal = document.getElementById("getBody").value;
    return getBodyVal;
}
var getTagValue = (e) => {
    e.preventDefault();

    var getTagVal = document.getElementById("getTag").value;
    return getTagVal;
}


document.querySelector(".submit").addEventListener("click", async (e)=>{

    const bodyObj = {
        title: getTitleValue(e),
        body: getBodyValue(e),
        tags: getTagValue(e),
        userId: getUserIdValue(e)
    }
    addPost(bodyObj);
});


const addPost = async (newBody) => {
    const response = await fetch(apiUrl + "/add", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newBody),
    });
    
    const data = await response.json();

    $(".card-title").html(data.title);
    $(".card-text").text(data.body);
    $(".card-tags").text("Tags: " + data.tags);

}


