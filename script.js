function updateCountdown() {
    const launchDate = new Date("May 24, 2025 00:00:00").getTime();
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) {
        document.getElementById("countdown").innerHTML = "Launched!";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Function to fetch GitHub profile picture
async function getGitHubProfilePicture(username) {
    console.log("Fetching profile for:", username);

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        return data.avatar_url;
    } catch (error) {
        console.error("Error fetching GitHub profile:", error);
        return "placeholder.jpg"; // Use a placeholder image if fetch fails
    }
}

// Function to create team member slide
async function createTeamSlide(username, name, title) {
    const profilePic = await getGitHubProfilePicture(username);
    const slide = document.createElement("div");
    slide.classList.add("team-slide");
    slide.innerHTML = `
        <img src="${profilePic}" alt="${name}">
        <h3>${name}</h3>
        <p>${title}</p>
        <a href="https://github.com/${username}" target="_blank">
            <i class="fab fa-github"></i> GitHub Profile
        </a>
    `;
    return slide;
}

// Function to populate team slideshow
async function populateTeamSlideshow() {
    const teamData = [
        { username: "batsonnoah58", name: "Mona Octocat", title: "GitHub Mascot" },
        { username: "torvalds", name: "Linus Torvalds", title: "Linux Creator" },
        { username: "gaearon", name: "Dan Abramov", title: "React Core Team" },
        {username: "defunkt", name: "Chris Wanstrath", title: "GitHub Co-Founder"}
    ];

    const slideshow = document.getElementById("teamSlideshow");
    for (const member of teamData) {
        const slide = await createTeamSlide(member.username, member.name, member.title);
        slideshow.appendChild(slide);
    }
}

populateTeamSlideshow();

// Add sliding effect to elements with 'slide-in' class
document.addEventListener('DOMContentLoaded', function() {
    // Select all elements that should have the sliding effect
    const slideElements = document.querySelectorAll('.slide-in');
    
    // IntersectionObserver callback to add "in-view" class when element is visible
    const observerCallback = function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Stop observing after animation has been triggered
                observer.unobserve(entry.target);
            }
        });
    };

    // Create the IntersectionObserver instance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each slide element
    slideElements.forEach(el => {
        observer.observe(el);
    });
});
