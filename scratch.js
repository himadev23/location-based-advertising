var $h2 = $("<h2>");
$h2.text(deal.title);
var $imgae = $("<img>");
$image.attr("src", deal.image_url);
$image.attr("alt", deal.title);
div.append($h2, $image);
