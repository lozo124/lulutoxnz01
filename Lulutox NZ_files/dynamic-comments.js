// Dynamic Comments Injection System for Lulutox (NZ localisation)

// Time formatting (NZ-friendly)
function dtime_nums(offset, showTime = false) {
  const now = new Date();
  const commentDate = new Date(now.getTime() + offset * 60 * 60 * 1000); // offset in hours
  const diff = now - commentDate;

  const oneDay = 1000 * 60 * 60 * 24;
  const oneHour = 1000 * 60 * 60;
  const oneMinute = 1000 * 60;

  const days = Math.floor(diff / oneDay);
  const hours = Math.floor((diff % oneDay) / oneHour);
  // Round minutes to nearest 5 for a more natural feel
  let minutes = Math.floor((diff % oneHour) / oneMinute);
  minutes = Math.max(1, Math.round(minutes / 5) * 5);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    if (diff < oneMinute) return "just now";
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
}

// Sort comments by time: older (more negative offset) first
function sortCommentsByTime(data) {
  const sorted = data
    .map((c) => ({
      ...c,
      replies: c.replies
        ? [...c.replies].sort((a, b) => a.timeOffset - b.timeOffset)
        : [],
    }))
    .sort((a, b) => a.timeOffset - b.timeOffset);

  return sorted;
}

// Generate avatar HTML - either image or letter circle
function generateAvatarHTML(avatar, name) {
  const isDefaultAvatar = !avatar || avatar === "img/default-avatar.png" || avatar.includes("default-avatar");

  if (isDefaultAvatar && name) {
    const firstLetter = name.trim().charAt(0).toUpperCase();
    const colors = ['#4A90D9', '#50C878', '#FF6B6B', '#9B59B6', '#F39C12', '#1ABC9C', '#E74C3C', '#3498DB'];
    const colorIndex = name.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];

    return `<div class="avatar-letter" style="background-color: ${bgColor}">${firstLetter}</div>`;
  }

  return `<img src="${avatar}" alt="${name}" class="b-lazy" loading="lazy">`;
}

// Generate HTML for a single comment
function generateCommentHTML(comment, isReply = false) {
  const replyClass = isReply ? " answer" : "";
  const imageHTML = comment.image
    ? `<img src="${comment.image}" class="comment-image b-lazy" alt="Comment image" loading="lazy">`
    : "";

  return `
    <div class="comment-flex${replyClass}" data-comment-id="${comment.id}">
      <div class="comment-left">
        <div class="comment-avatar">
          ${generateAvatarHTML(comment.avatar, comment.name)}
        </div>
      </div>
      <div class="comment-right">
        <div class="comment-text">
          <div class="comment-info">
            <p class="name">${comment.name}</p>
          </div>
          <p class="text">${comment.text}</p>
          ${imageHTML}
        </div>
        <div class="comment-footer">
          <div class="like" onclick="toggleLike(${comment.id}, ${isReply})">Like</div>
          <div class="reply" onclick="showReplyForm(${comment.id})">Reply</div>
          <div class="likes-count">
            <div class="like-icon"></div>
            <span class="like-count">${comment.likes}</span>
          </div>
          <div class="date">${dtime_nums(comment.timeOffset)}</div>
        </div>
      </div>
    </div>
  `;
}

// Generate HTML for all comments
function generateAllCommentsHTML() {
  let html = "";

  const base = Array.isArray(commentsData) ? commentsData : [];
  const sortedComments = sortCommentsByTime(base);

  sortedComments.forEach((comment) => {
    html += `<div class="comment">`;
    html += generateCommentHTML(comment, false);

    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach((reply) => {
        html += generateCommentHTML(reply, true);
      });
    }

    html += `</div>`;
  });

  // "Share your experience" button
  html += `
    <div class="share-experience-section">
      <button class="share-experience-btn" onclick="showCommentForm()">
        Share your experience
      </button>
    </div>
  `;

  return html;
}

// Like functionality
let likedComments = new Set(
  JSON.parse(localStorage.getItem("lulutox_liked_comments") || "[]")
);

function toggleLike(commentId, isReply = false) {
  const likeKey = isReply ? `reply_${commentId}` : `comment_${commentId}`;
  const commentElement = document.querySelector(
    `[data-comment-id="${commentId}"]`
  );
  if (!commentElement) return;

  const likeCountElement = commentElement.querySelector(".like-count");
  const likeButton = commentElement.querySelector(".like");
  let currentLikes = parseInt(likeCountElement.textContent);

  if (likedComments.has(likeKey)) {
    // Unlike
    likedComments.delete(likeKey);
    currentLikes = Math.max(0, currentLikes - 1);
    likeButton.classList.remove("liked");
    likeButton.textContent = "Like";
  } else {
    // Like
    likedComments.add(likeKey);
    currentLikes++;
    likeButton.classList.add("liked");
    likeButton.textContent = "Liked";
  }

  likeCountElement.textContent = currentLikes;
  localStorage.setItem(
    "lulutox_liked_comments",
    JSON.stringify([...likedComments])
  );
}

// User data storage
let userData = JSON.parse(localStorage.getItem("lulutox_user_data") || "{}");

// Generate comment form HTML (EN NZ)
function generateCommentFormHTML(isReply = false, parentCommentId = null) {
  const savedAvatar = userData.avatar || "";
  const savedName = userData.name || "";
  const formTitle = isReply ? "Reply to comment" : "Leave a comment";
  const submitButtonText = isReply ? "Post reply" : "Post";
  const formId = isReply ? `reply-form-${parentCommentId}` : "main-comment-form";

  return `
    <div class="comment-form-overlay" id="${formId}-overlay">
      <div class="comment-form-container">
        <div class="comment-form-header">
          <h3>${formTitle}</h3>
          <button class="close-form-btn" onclick="hideCommentForm('${formId}')">&times;</button>
        </div>
        <form class="comment-form" id="${formId}">
          <div class="form-row">
            <div class="form-group avatar-group">
              <label>Avatar (optional):</label>
              <div class="avatar-upload">
                <input type="file" id="${formId}-avatar" accept="image/*" onchange="previewAvatar(this, '${formId}')">
                <div class="avatar-preview" id="${formId}-avatar-preview" onclick="document.getElementById('${formId}-avatar').click()">
                  ${
    savedAvatar
      ? `<img src="${savedAvatar}" alt="Avatar"><button type="button" onclick="event.stopPropagation(); removeAvatar('${formId}')" class="remove-avatar-btn">&times;</button>`
      : "<span>+</span>"
  }
                </div>
                <label for="${formId}-avatar" class="avatar-upload-label">Upload photo</label>
              </div>
            </div>
            <div class="form-group name-group">
              <label for="${formId}-name">Name *:</label>
              <input type="text" id="${formId}-name" value="${savedName}" required placeholder="Your name">
            </div>
          </div>
          <div class="form-group">
            <label for="${formId}-text">Comment *:</label>
            <textarea id="${formId}-text" required placeholder="Write your comment..."></textarea>
          </div>
          <div class="form-group">
            <label>Photo (optional):</label>
            <div class="photo-upload">
              <input type="file" id="${formId}-photo" accept="image/*" onchange="previewPhoto(this, '${formId}')">
              <div class="photo-preview" id="${formId}-photo-preview" style="display: none;">
                <img src="" alt="Preview">
                <button type="button" onclick="removePhoto('${formId}')" class="remove-photo-btn">&times;</button>
              </div>
              <label for="${formId}-photo" class="photo-upload-label">
                <span class="upload-icon">📷</span>
                Add photo
              </label>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" onclick="hideCommentForm('${formId}')" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn">${submitButtonText}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Show main comment form
function showCommentForm() {
  const existingForm = document.getElementById("main-comment-form-overlay");
  if (existingForm) {
    existingForm.style.display = "flex";
    return;
  }

  const formHTML = generateCommentFormHTML(false);
  document.body.insertAdjacentHTML("beforeend", formHTML);

  document
    .getElementById("main-comment-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      submitComment(false);
    });
}

// Show reply form (less formal addressing handled by comment text itself)
function showReplyForm(commentId) {
  const existingForm = document.getElementById(`reply-form-${commentId}-overlay`);
  if (existingForm) {
    existingForm.style.display = "flex";
    return;
  }

  const formHTML = generateCommentFormHTML(true, commentId);
  document.body.insertAdjacentHTML("beforeend", formHTML);

  document
    .getElementById(`reply-form-${commentId}`)
    .addEventListener("submit", function (e) {
      e.preventDefault();
      submitComment(true, commentId);
    });
}

// Hide comment form
function hideCommentForm(formId) {
  const overlay = document.getElementById(`${formId}-overlay`);
  if (overlay) {
    overlay.style.display = "none";
  }
}

// Preview avatar function
function previewAvatar(input, formId) {
  const preview = document.getElementById(`${formId}-avatar-preview`);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="Avatar"><button type="button" onclick="event.stopPropagation(); removeAvatar('${formId}')" class="remove-avatar-btn">&times;</button>`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Preview photo function
function previewPhoto(input, formId) {
  const preview = document.getElementById(`${formId}-photo-preview`);
  const img = preview.querySelector("img");

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
      preview.style.display = "block";
      input.parentElement.querySelector(".photo-upload-label").style.display = "none";
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Remove photo function
function removePhoto(formId) {
  const preview = document.getElementById(`${formId}-photo-preview`);
  const input = document.getElementById(`${formId}-photo`);
  const label = input.parentElement.querySelector(".photo-upload-label");

  preview.style.display = "none";
  input.value = "";
  label.style.display = "flex";
}

// Remove avatar function
function removeAvatar(formId) {
  const preview = document.getElementById(`${formId}-avatar-preview`);
  const input = document.getElementById(`${formId}-avatar`);

  preview.innerHTML = "<span>+</span>";
  input.value = "";
}

// Generate unique ID for new comments
function generateUniqueId() {
  const existingIds = [];

  // Collect existing comment IDs
  (Array.isArray(commentsData) ? commentsData : []).forEach((comment) => {
    existingIds.push(comment.id);
    if (comment.replies) {
      comment.replies.forEach((reply) => {
        existingIds.push(reply.id);
      });
    }
  });

  // Get user comments from localStorage
  const userComments = JSON.parse(localStorage.getItem("lulutox_user_comments") || "[]");
  userComments.forEach((comment) => {
    existingIds.push(comment.id);
    if (comment.replies) {
      comment.replies.forEach((reply) => {
        existingIds.push(reply.id);
      });
    }
  });

  // Find next available ID
  let newId = Math.max(...existingIds, 0) + 1;
  while (existingIds.includes(newId)) {
    newId++;
  }

  return newId;
}

// Submit comment function
function submitComment(isReply = false, parentCommentId = null) {
  const formId = isReply ? `reply-form-${parentCommentId}` : "main-comment-form";
  const form = document.getElementById(formId);

  const nameInput = document.getElementById(`${formId}-name`);
  const textInput = document.getElementById(`${formId}-text`);
  const avatarInput = document.getElementById(`${formId}-avatar`);
  const photoInput = document.getElementById(`${formId}-photo`);

  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) {
    alert("Please fill in the required fields");
    return;
  }

  // Process avatar
  let avatarData = userData.avatar || "";
  if (avatarInput.files && avatarInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      avatarData = e.target.result;
      processCommentSubmission();
    };
    reader.readAsDataURL(avatarInput.files[0]);
    return;
  }

  processCommentSubmission();

  function processCommentSubmission() {
    // Process photo
    let photoData = null;
    if (photoInput.files && photoInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        photoData = e.target.result;
        saveComment();
      };
      reader.readAsDataURL(photoInput.files[0]);
    } else {
      saveComment();
    }

    function saveComment() {
      // Save user data for future convenience
      userData.name = name;
      userData.avatar = avatarData;
      localStorage.setItem("lulutox_user_data", JSON.stringify(userData));

      // Create comment object
      const newComment = {
        id: generateUniqueId(),
        avatar: avatarData || "img/default-avatar.png",
        name: name,
        text: text,
        image: photoData,
        likes: 0,
        timeOffset: 0, // now
      };

      // Save to localStorage
      let userComments = JSON.parse(localStorage.getItem("lulutox_user_comments") || "[]");

      if (isReply) {
        let parentFound = false;

        // Try to append reply to original comments
        (Array.isArray(commentsData) ? commentsData : []).forEach((comment) => {
          if (comment.id == parentCommentId) {
            if (!comment.replies) comment.replies = [];
            comment.replies.push(newComment);
            parentFound = true;
          }
        });

        // Try user comments
        if (!parentFound) {
          userComments.forEach((comment) => {
            if (comment.id == parentCommentId) {
              if (!comment.replies) comment.replies = [];
              comment.replies.push(newComment);
              parentFound = true;
            }
          });
        }

        // Persist if parent lives in userComments
        if (parentFound) {
          localStorage.setItem("lulutox_user_comments", JSON.stringify(userComments));
        }
      } else {
        // Add new top-level user comment
        userComments.push(newComment);
        localStorage.setItem("lulutox_user_comments", JSON.stringify(userComments));
      }

      // Hide form and refresh comments
      hideCommentForm(formId);
      refreshComments();

      // Scroll to new comment
      setTimeout(() => {
        const newCommentEl = document.querySelector(`[data-comment-id="${newComment.id}"]`);
        if (newCommentEl) {
          newCommentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          newCommentEl.style.transition = 'background-color 0.3s ease';
          newCommentEl.style.backgroundColor = 'rgba(0, 102, 204, 0.1)';
          setTimeout(() => {
            newCommentEl.style.backgroundColor = '';
          }, 2000);
        }
      }, 100);
    }
  }
}

// Refresh comments display
function refreshComments() {
  const base = Array.isArray(commentsData) ? commentsData : [];
  const allComments = [...base];
  const userComments = JSON.parse(localStorage.getItem("lulutox_user_comments") || "[]");
  allComments.push(...userComments);

  const originalCommentsData = [...base];
  commentsData.length = 0;
  commentsData.push(...sortCommentsByTime(allComments));

  const commentsWrapper = document.querySelector(".comments-wrapper");
  if (commentsWrapper) {
    const titleMatch = commentsWrapper.innerHTML.match(
      /<h2[^>]*class="comments-title"[^>]*>.*?<\/h2>/
    );
    const title = titleMatch ? titleMatch[0] : '<h2 class="comments-title">Comments</h2>';
    commentsWrapper.innerHTML = title + generateAllCommentsHTML();

    // Apply liked states
    likedComments.forEach((likeKey) => {
      const [, id] = likeKey.split("_");
      const commentElement = document.querySelector(`[data-comment-id="${id}"]`);
      if (commentElement) {
        const likeButton = commentElement.querySelector(".like");
        likeButton.classList.add("liked");
        likeButton.textContent = "Liked";
      }
    });
  }

  // Restore original commentsData
  commentsData.length = 0;
  commentsData.push(...originalCommentsData);
}

// Initialize comments
function initializeComments() {
  const commentsWrapper = document.querySelector(".comments-wrapper");
  if (!commentsWrapper) {
    console.error("Comments wrapper not found!");
    return;
  }

  const userComments = JSON.parse(localStorage.getItem("lulutox_user_comments") || "[]");
  const base = Array.isArray(commentsData) ? commentsData : [];
  const allComments = [...base, ...userComments];

  const originalCommentsData = [...base];
  commentsData.length = 0;
  commentsData.push(...sortCommentsByTime(allComments));

  const existingComments = commentsWrapper.innerHTML;
  const titleMatch = existingComments.match(
    /<h2[^>]*class="comments-title"[^>]*>.*?<\/h2>/
  );
  const title = titleMatch ? titleMatch[0] : '<h2 class="comments-title">Comments</h2>';

  commentsWrapper.innerHTML = title + generateAllCommentsHTML();

  likedComments.forEach((likeKey) => {
    const [, id] = likeKey.split("_");
    const commentElement = document.querySelector(`[data-comment-id="${id}"]`);
    if (commentElement) {
      const likeButton = commentElement.querySelector(".like");
      likeButton.classList.add("liked");
      likeButton.textContent = "Liked";
    }
  });

  // Restore original
  commentsData.length = 0;
  commentsData.push(...originalCommentsData);

  console.log("Dynamic comments initialized successfully!");
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initializeComments);

// Fallback for jQuery ready
if (typeof $ !== "undefined") {
  $(document).ready(initializeComments);
}
