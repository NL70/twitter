let tweets = [];
const tweetButton = document.getElementById("tweet-button");

const apiURL = "http://localhost:4000";

const fetchTweets = async () => {
  const response = await fetch(`${apiURL}/tweets`).then((res) => res.json());

  tweets = response.data;
};

const addTweet = async (data) => {
  const tweetData = {
    contents: data.contents,
    creator_id: data.creator_id,
  };
  const response = await fetch(`${apiURL}/tweets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tweetData),
  }).then((res) => res.json());
  document.getElementById("tweet").value = "";
  return response.data;
};

const showTweets = async () => {
  await fetchTweets();

  const tweetList = document.getElementById("tweet-list");
  const tweetForm = document.getElementById("tweet-form");
  tweets.forEach((element) => {
    createTweetCard(tweetList, element);
  });

  tweetForm.onsubmit = async (event) => {
    event.preventDefault();
    const contents = document.getElementById("tweet").value;
    if (contents) {
      const data = await addTweet({ contents: contents, creator_id: 1 });

      createTweetCard(tweetList, data, true);
    }
  };
};

showTweets();

async function createTweetCard(tweetList, data, isAdd) {
  const { content, datecreated, creator_id } = data;
  const formattedDate = new Date(datecreated);

  const li = document.createElement("li");
  const tweetCard = document.createElement("div");
  tweetCard.setAttribute("id", "tweet-card");
  const profileWrapper = document.createElement("div");
  const a = document.createElement("a");
  const contentP = document.createElement("p");
  const date = document.createElement("p");
  date.setAttribute("id", "date");

  if (isAdd) {
    tweetList.prepend(li);
  } else {
    tweetList.appendChild(li);
  }
  li.appendChild(tweetCard);
  tweetCard.appendChild(profileWrapper);
  profileWrapper.appendChild(a);
  tweetCard.appendChild(contentP);
  tweetCard.appendChild(date);

  contentP.innerText = content;
  date.innerText = formattedDate.toISOString().substring(0, 10);
  a.innerText = "adsf";
}
