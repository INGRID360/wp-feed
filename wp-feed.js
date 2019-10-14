/**
 * Display placeholder
 * @param {number} posts The number of posts
 * @returns {*} display the posts
 */

const wpsDisplayPlaceholder = posts => {
  let preload = "";

  for (let item = 0; item < posts; item += 1) {
    preload += `<figure class="wps-box wps-skeleton">
     </figure>`;
  }

  document.getElementById("wpsContent").innerHTML = preload;
};

/**
 * Function we call everytime we need to refresh data
 * Calls Wordpress Rest API and builds object
 */

const wpsFetch = async () => {
  // Get values from data attributes
  const selector = document.querySelector("#wps-feed");
  const url = selector.getAttribute("data-url");
  const posts = selector.getAttribute("data-posts");

  // Display placeholder
  wpsDisplayPlaceholder(posts);

  // Build string and fetch
  const restApi = `${url}/wp-json/wp/v2/posts?_embed&order=desc&per_page=${posts}`;
  const response = await fetch(restApi);
  const data = await response.json();

  return data;
};

/**
 *  Push to frontend
 *  writes out data to to frontend
 */

const wpsDisplay = async () => {
  let output = "";
  const data = await wpsFetch();

  // Loop out data
  data.forEach(item => {
    const post = { image: "dont exist", title: "", link: "" };
    post.title = item.title.rendered;
    post.link = item.link;
    if (item._embedded["wp:featuredmedia"]) {
      post.image =
        item._embedded["wp:featuredmedia"][0].media_details.sizes[
          "full"
        ].source_url;
    }

    output += `<figure class="wps-box"><a href="${post.link}" target="_blank" title="${post.title}">
     <img loading="lazy" alt="${post.title}" src="${post.image}"><div class="wps-content text-center"><span class="wps_box_text">${post.title}</span></div></a></figure>`;
  });

  document.getElementById("wpsContent").innerHTML = output;
};

/**
 *  Shopify Event listener
 *  listen for changes in settings and trigger update to provide
 *  a good UX in customizer
 */

document.addEventListener("shopify:section:load", function(event) {
  if (event.detail.sectionId === event.detail.sectionId) {
    wpsDisplay();
  }
});
document.addEventListener("shopify:section:select", function(event) {
  if (event.detail.sectionId === event.detail.sectionId) {
    wpsDisplay();
  }
});
