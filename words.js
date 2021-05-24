const Arr = [
  "table",
  "door",
  "computer",
  "java",
  "javascript",
  "banana",
  "brush",
];

module.exports = () => {
  // random index

  return Arr[Math.floor(Math.random() * Arr.length)];
};
