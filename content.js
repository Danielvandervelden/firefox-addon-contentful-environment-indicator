(function () {
    const CONTENTFUL_CONTAINER = '[data-test-id="loaded-app"]';
    const buttonNodeSelector = '[data-test-id="cf-ui-space-nav-space-trigger"]';

    let followerDiv;

    // Utility to detect the environment
    function detectEnvironment() {
        const buttonNode = document.querySelector(buttonNodeSelector);
        if (!buttonNode) return null;

        const environmentText = buttonNode.innerHTML.trim();
        if (environmentText.toLowerCase().includes("develop")) {
            return "develop";
        } else if (environmentText.toLowerCase().includes("master")) {
            return "master";
        }
        return "other";
    }

    // Update the follower div's content and color
    function updateFollower() {
        const environment = detectEnvironment();
        if (!followerDiv || !environment) return;

        // Update the background color based on the environment
        followerDiv.style.backgroundColor =
            environment === "develop"
                ? "green"
                : environment === "master"
                ? "red"
                : "gray";

        // Update the content
        const buttonNode = document.querySelector(buttonNodeSelector);
        if (buttonNode) {
            followerDiv.innerHTML = buttonNode.innerHTML;
        }

        // Show the follower
        followerDiv.style.display = "flex";
    }

    // Remove all instances of the follower div
    function removeExistingFollowers() {
        const existingFollowers = document.querySelectorAll(".custom-follower-div");
        existingFollowers.forEach((div) => div.remove());
    }

    // Create the follower div
    function createFollowerDiv() {
        // Remove any existing instances
        removeExistingFollowers();

        // Create a new div
        followerDiv = document.createElement("div");
        followerDiv.classList.add("custom-follower-div");

        document.body.appendChild(followerDiv);

        // Update position based on mouse movement
        document.addEventListener("mousemove", (e) => {
            if (followerDiv) {
                followerDiv.style.left = `${e.pageX + 10}px`;
                followerDiv.style.top = `${e.pageY + 10}px`;
            }
        });

        updateFollower();
    }

    // Observe changes in the main container to handle environment switching
    function setupMutationObserver() {
        const container = document.querySelector(CONTENTFUL_CONTAINER);
        if (!container) return;

        const observer = new MutationObserver(() => {
            // Recheck and update the follower when the container changes
            updateFollower();
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
        });
    }

    // Initialize the script
    function initialize() {
        createFollowerDiv();
        setupMutationObserver();
    }

    // Wait for the app to load and initialize
    function waitForAppToLoad() {
        const checkExist = setInterval(() => {
            const container = document.querySelector(CONTENTFUL_CONTAINER);
            if (container) {
                clearInterval(checkExist);
                initialize();
            }
        }, 500);
    }

    waitForAppToLoad();
})();
