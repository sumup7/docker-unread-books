'use strict';
import $ from 'jquery';
globalThis.jQuery = $;
import bootstrap from 'bootstrap';

$(function() {
$('#check').click((e) => {
  console.log('クリックされた');
  e.preventDefault();
  const isbn = $("#isbn").val();
  console.log(isbn);
  const url = "https://api.openbd.jp/v1/get?isbn=" + isbn;
  
  $.getJSON(url, function(data) {
    if(data[0] == null) {
      $("#thumbnail").html('<p>データがありませんフォームから本の情報を入力してください</p>');
      console.log('存在しないisbn');
    } else {
      if(data[0].summary.cover == "") {
        $("#thumbnail").html('<p>画像データがありません<p>');
      }　else {
        const photoUrl = data[0].summary.cover;
        $("#thumbnail").html('<img src=\"' + photoUrl + '\" style=\"border:solid 1px #000000\" />');
        $("#photoUrl").val(data[0].summary.cover);
        $("#bookTitle").val(data[0].summary.title);
        // const str = data[0].summary.author;
        // const author = str.slice(0, -2);
        $("#author").val(data[0].summary.author);
        $("#publisher").val(data[0].summary.publisher);
      }
    }
  })
})
})