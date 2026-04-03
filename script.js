/**
 * Function to change the video and update the UI
 * @param {string} videoSrc - The path to the video file
 * @param {string} title - The title of the lesson
 */
function changeVideo(videoSrc, title) {
    // 1. Select the video element and the title element
    const videoPlayer = document.getElementById('main-video');
    const titleElement = document.getElementById('current-lesson-title');
    const playlistItems = document.querySelectorAll('#playlist li');

    // 2. Update the video source and title text
    // Note: If you don't have real videos yet, the player will show an error or blank
    videoPlayer.src = videoSrc;
    titleElement.innerText = title;

    // 3. Update the "Active" styling in the sidebar
    playlistItems.forEach(item => {
        item.classList.remove('active'); // Remove active class from all
        
        // If this item's text contains the title, make it active
        if (item.innerText.includes(title)) {
            item.classList.add('active');
        }
    });

    // 4. Auto-play the video (browsers might block this unless the user interacted first)
    videoPlayer.play().catch(error => {
        console.log("Auto-play prevented by browser. User must click play.");
    });
}

// Logic for the "Mark as Complete" button
const completeBtn = document.querySelector('.btn-complete');
completeBtn.addEventListener('click', function() {
    alert("Great job! Lesson marked as complete.");
    
    // Find the active lesson and update the checkmark
    const activeLesson = document.querySelector('#playlist li.active .status');
    if (activeLesson) {
        activeLesson.innerText = "✔";
        activeLesson.style.color = "#4facfe";
    }
});