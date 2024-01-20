let API_LINK = 'https://api.github.com/users';
let search_btn = document.querySelector(".search");
let search_term = document.getElementById("search-term");

let searching = document.querySelector(".searching");
search_term.focus();
let repo = new Array(0);

search_btn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (search_term.value) {
        searching.innerHTML = 'Searching...';

        try {
            const userData = await getUserDetaile(`${API_LINK}/${search_term.value}`);
            const repoData = await getRepoDetaile(`${API_LINK}/${search_term.value}/repos`);

            showUserDetails(userData, repoData);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch user details.');
        }
    } else {
        alert('Please enter any GitHub username');
        search_term.focus();
    }
});

// Function to show user Data on screen
function showUserDetails(data, repos) {
    var box = document.querySelector(".box-body");
    var j = ``;

    // Display up to '10' repositories per page in a column layout
    j += '<div class="respos-col">';
    repos.slice(0, 10).forEach(repo => {
        j += `<a href="${repo.html_url}" target="_blank"><li>${repo.name}</li></a>`;

        // Check if topics are available for the repository
        if (repo.topics && repo.topics.length > 0) {
            j += `<p>Topics: ${repo.topics.join(', ')}</p>`;
        }
    });
    j += '</div>';

    searching.innerHTML = "";

    box.innerHTML = (`
        <div class="profile-box">
            <div class="row">
                <div class="image">
                    <img src="${data.avatar_url}" alt="">
                </div>
                <div class="about">
                    <div class="details">
                        <h1 class="name">${data.name}</h1>
                        <h3 class="username">@${data.login}</h3>
                        <p class="country"><span><ion-icon name="location-sharp"></ion-icon></span>${data.location === null ? 'Unknown' : data.location}</p>
                    </div>
                    <div class="btn-profile">
                        <a href="${data.html_url}" target="_blank">Visit Profile</a>
                    </div>
                </div>
            </div>
            <div class="bio">
                <h3>About</h3>
                <p>${data.bio === null ? 'Bio description is unavailable' : data.bio}</p>
            </div>
            <div class="respos-row">
                <ul id="repo">
                    ${j}
                </ul>
            </div>
            <div class="pagination">
                <label for="repo-per-page">Repositories per page:</label>
                <select id="repo-per-page" onchange="updateRepoPerPage()">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>
    `);
}

// Fetching user details
async function getUserDetaile(api) {
    try {
        const query = await fetch(api);
        const result = await query.json();

        if (result.name === null) {
            throw new Error("User not found");
        }

        return result;
    } catch (error) {
        throw error;
    }
}

// Function to get repositories link
async function getRepoDetaile(repi_api) {
    try {
        const repo_query = await fetch(repi_api);
        const repo_result = await repo_query.json();

        return repo_result;
    } catch (error) {
        throw error;
    }
}
