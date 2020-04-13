
var commentIndex = 1;

function getCommentIndex(){
    return commentIndex++
}

function getReplyIndex(){
    let newDate = new Date().getTime()
    return newDate
}

var comments = [];

let container = document.getElementById('container');
let nestedComments = document.createElement('div');
nestedComments.className = "nested-comments";
container.appendChild(nestedComments)  


function openDialog(){
    let btn = document.getElementById('firstbtn');
    btn.remove();
    
    let comment_cont = document.createElement('div');
    comment_cont.className = "comment-container";

    let mainCommentInput = document.createElement('input');
    mainCommentInput.className = "main-comment-input";
    mainCommentInput.placeholder = "Enter Your comment";

    comment_cont.appendChild(mainCommentInput);

    let mainCommentBtn = document.createElement('button');
    mainCommentBtn.className = "main-comment-button";
    mainCommentBtn.innerHTML = "submit";
    mainCommentBtn.addEventListener('click',function(){
        let comment = {
            id : getCommentIndex(),
            comment : mainCommentInput.value,
            replies : []
        }

        comments.push(comment);
        mainCommentInput.value = '';
        createNewComment(comment,nestedComments,false)
    });

    comment_cont.appendChild(mainCommentBtn);
    container.insertBefore(comment_cont,container.children[0])

}

function addReply(comments,itemId,reply){
    if(comments){
        comments.map(comment => {
            if(comment.id == itemId){
                return comment.replies.push(reply)
            }else{
                addReply(comment.replies,itemId,reply)
            }
        });
    }

    localStorage.setItem('nested-comments',JSON.stringify(comments))
}

 

function addReplyBox(id){
    let parentCommentItem = document.getElementsByClassName('comment-item-'+id)[0];

    let replyBox = document.createElement('div');
    replyBox.className = 'reply-box reply-box-'+id;
    
    let replyBoxInput = document.createElement('input');
    replyBoxInput.className = 'reply-input'
    replyBoxInput.placeholder = "Enter Your Reply";

    replyBox.appendChild(replyBoxInput);

    let replyBoxBtn = document.createElement('button');
    replyBoxBtn.className = "reply-btn reply-btn-"+id;
    replyBoxBtn.innerHTML = "Reply";
    replyBoxBtn.id = id;

    replyBoxBtn.addEventListener('click',function(){
        let reply ={
            id: id+' '+getReplyIndex(),
            comment: replyBoxInput.value,
            replies : []
        }

        let itemId = this.id;
        addReply(comments,itemId,reply)
        createNewComment(reply,parentCommentItem,true)

        replyBoxInput.value ='';    
        parentCommentItem.removeChild(replyBox)
    })

    replyBox.appendChild(replyBoxBtn);
    parentCommentItem.insertBefore(replyBox, parentCommentItem.children[2]);

}



function createNewComment(comment,parent,isReply){
    let id = comment.id;
    let newCommentItem = document.createElement('div');
    if(isReply){
        newCommentItem.className = "comment-item reply-item comment-item-"+id;
    }else{
        newCommentItem.className = "comment-item comment-item-"+id;
    }

    let newCommentText = document.createElement('div')
    newCommentText.className = "comment-item-text";
    newCommentText.innerHTML = comment.comment;
    newCommentItem.appendChild(newCommentText)

    let newCommentBtn = document.createElement('button');
    newCommentBtn.className = "comment-reply comment-reply-"+id
    newCommentBtn.innerHTML = "Reply"
    newCommentBtn.addEventListener('click',function(){
        let itemId = id;
        let replyBox = document.getElementsByClassName('reply-box');
        if (replyBox.length > 0) {
            replyBox[0].parentElement.removeChild(replyBox[0]);
          }
        
        addReplyBox(itemId);
    })

    newCommentItem.appendChild(newCommentBtn);
    parent.appendChild(newCommentItem);

    if(comment.replies && comment.replies.length > 0){
        comment.replies.map(reply => {
            createNewComment(reply,newCommentItem,true);
        })
    }
}


function runthis(){
    comments.map(comment => {
        createNewComment(comment,nestedComments,false)
    });
}

function runOnClose(){
    localStorage.removeItem('nested-comments')
}

let localComments = JSON.parse(localStorage.getItem('nested-comments'));
if(localComments && localComments.length>0){
    comments = localComments;
    runthis();  
}

window.onload = runOnClose();
fdsdfsdfdsfsdfsdf