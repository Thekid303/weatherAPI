var api_key = "55c2aaa51a8ed764680bc6f9d89bd204";
var forecastContainer = document.querySelector("#forecast-container");
var $cityText = document.querySelector("#city-text");
var currentContainer = document.querySelector("#current-container");
var historyContainer = document.querySelector("#history-container");
var past = JSON.parse(localStorage.getItem("history")) || [];