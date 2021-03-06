let showPosts = [];
let firstIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
    
    const username = document.querySelector("#username");
    const followButton = document.querySelector('#follow');
    const unfollowButton = document.querySelector('#unfollow');
    const allPosts = document.querySelector('#all-posts');
    const followingPosts = document.querySelector('#following-page');
    const paginationElement = document.querySelector('.pagination');
    const nextButton = document.querySelector('#next');
    const previousButton = document.querySelector('#previous');

    if (followButton) {
        followButton.addEventListener('click', () => follow(username.innerHTML, 'true'));
    }
    if (unfollowButton) {
        unfollowButton.addEventListener('click', () => follow(username.innerHTML, 'false'));
    }

    if (username) {
        load_posts(username.innerHTML)
        nextButton.addEventListener('click', () => pagination('#user-posts', 'next'));
        previousButton.addEventListener('click', () => pagination('#user-posts', 'previous'));
    } else if (allPosts) {
        load_posts('all');
        previousButton.addEventListener('click', () => pagination('#all-posts', 'previous'));
        nextButton.addEventListener('click', () => pagination('#all-posts', 'next'));
    } else if (followingPosts) {
        load_posts('current');
        previousButton.addEventListener('click', () => pagination('#user-posts', 'previous'));
        nextButton.addEventListener('click', () => pagination('#user-posts', 'next'));
    } else {
        paginationElement.style.display = 'none';
    }
});

function like (postId, element) {
    fetch(`/${postId.toString()}`, {
        method: 'PUT',
        body: JSON.stringify({
            like: 'true',
        })
      })
    .then(response => response.json())
    .then(post => {
        element.innerHTML = ' ' + post.likes;
    })
}

function load_posts(filter) {

    fetch(`/${filter}`)
    .then(response => response.json())
    .then(posts => {
        
        posts.forEach(post => {

            // Create elements
            const div = document.createElement('div');
            div.className = 'hide post rounded';
            
            const anchor = document.createElement('a');
            anchor.href = `/user/${post.user}`;

            const username = document.createElement('div');
            username.innerHTML = post.user;
            username.className = 'post-username';

            const timestamp = document.createElement('div');
            timestamp.innerHTML = post.timestamp;
            timestamp.className = 'timestamp';

            const content = document.createElement('div');
            content.innerHTML = post.content;

            const textarea = document.createElement('textarea');
            textarea.innerHTML = content.innerHTML;
            textarea.style.display = 'none';

            if (post.user == document.querySelector('#logged-user strong').innerHTML) {
                const editButton = document.createElement('button');
                editButton.innerHTML = 'Edit';
                editButton.className = 'btn btn-primary';
                const saveButton = document.createElement('button');
                saveButton.innerHTML = 'Save';
                saveButton.className = 'btn btn-primary';
                saveButton.style.display = 'none';
                editButton.addEventListener('click', () => edit(content, textarea, editButton, saveButton, post.id));
                div.append(editButton);
                div.append(saveButton);
            }

            const icon = document.createElement('i');
            icon.className = 'fa fa-heart-o';
            icon.innerHTML = ' ' + post.likes;
            icon.addEventListener('click', () => like(post.id, icon));

            anchor.append(username);
            div.append(anchor);
            div.append(content);
            div.append(textarea);
            div.append(icon);
            div.append(timestamp);
            
            showPosts.push(div);
        })

        if (filter === "all") {
            pagination('#all-posts', 'none');
        } else { 
            pagination('#user-posts', 'none');
        }  
    })
}

function edit(element, textarea, editButton, saveButton, postId) {
    element.style.display = 'none';
    textarea.style.display = 'block';
    editButton.style.display = 'none';
    saveButton.style.display = 'block';

    saveButton.addEventListener('click', () => {

        const content = textarea.value;
        element.innerHTML = content;

        fetch(`${postId.toString()}`, {
            method: 'PUT',
            body: JSON.stringify({
                content: `${content}`
            })
        })

        element.style.display = 'block';
        textarea.style.display = 'none';
        editButton.style.display = 'block';
        saveButton.style.display = 'none';

    })
}

function follow(username, change) {
    fetch(`/user/${username}`, {
        method: 'PUT',
        body: JSON.stringify({
            follow: `${change}`
        })
      })
    .then(response => response.json())
    .then(info => {
        document.querySelector('#foll-numb').innerHTML = info.followers;

    })
}

function pagination(appendHere, action) {
    
    if (action === 'next'){
        firstIndex += 10;
    } else if (action === 'previous') {
        firstIndex -= 10
    }

    let lastIndex = firstIndex +10
    const previousPosts = document.querySelectorAll('.hide')

    if (firstIndex === 0) {
        document.querySelector('#previous').style.display = 'none';
    } else if (lastIndex >= showPosts.length) {
        document.querySelector('#next').style.display = 'none';
        
    } else {
        document.querySelector('#next').style.display = 'block';
        document.querySelector('#previous').style.display = 'block';
    }

    if (previousPosts) {
        previousPosts.forEach( post => {
            post.style.display = 'none';
        })
    }

    for (let i = firstIndex; (i < showPosts.length) && (i < lastIndex); i++) {
        showPosts[i].style.display = 'block';
        document.querySelector(appendHere).append(showPosts[i]);
    }
}