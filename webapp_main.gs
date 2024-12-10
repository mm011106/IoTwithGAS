// web app
// Postリクエストを受け付けた場合の処理
// 　　リクエストに含まれるJSONデータをパースして処理
// 　　　sheet_name:データを追加するシート名
// 　　　temperature:データ本体

function doPost(e) {
  
  // 送信されてくるJSONデータ　{"temperature":value}　から、要素を取り出す
  var params = JSON.parse(e.postData.getDataAsString());
  var sheet_name = params.sheet_name;
  var temperature = params.temperature;
  var humidity = params.humidity;
  var pressure = params.pressure;

  // console.log(sheet_name);
  // console.log(temperature);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
  if (!sheet) {
   //　指定したシートがない場合の処理;
   addSheet(sheet_name);
   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
   sheet.getRange(1, 1).setValue('Date-Time');
   sheet.getRange(1, 2).setValue('temperature');
   sheet.getRange(1, 3).setValue('humidity');
   sheet.getRange(1, 4).setValue('pressure');
  }

  // データをシートに追加
  sheet.insertRows(2,1);  // 2行1列目に列を挿入する
  sheet.getRange(2, 1).setValue(new Date());      // 受信日時を記録
  sheet.getRange(2, 2).setValue(temperature);     // 温度を記録
  sheet.getRange(2, 3).setValue(humidity);        // 湿度を記録
  sheet.getRange(2, 4).setValue(pressure);        // 気圧を記録

  return; // エラーかどうかを返した方がいいかも
  // return HtmlService.createHtmlOutput('<b>Got it</b>');
  // return ContentService.createTextOutput("受付けました。");
}


// (1) リクエストを受け取ると doGet が実行される
function doGet() {
  // // (2) Spreadsheet からデータを読み込む
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sensor1');
  let values = sheet.getRange('B2').getValues();
  console.log(values);

  // // (3) テンプレートを使ってHTML文書を作って return
  // let template = HtmlService.createTemplateFromFile("list");
  // template.links = values; // こうしておくとテンプレートの方で links という変数に値が入った状態で使える
  // // return template.evaluate();
  // return HtmlService.createHtmlOutput('<b>Hello, world!</b>');
  // (3) テンプレートを使ってHTML文書を作って return
  let template = HtmlService.createTemplateFromFile("list");
  template.values = values; // こうしておくとテンプレートの方で links という変数に値が入った状態で使える
  // return template.evaluate();
  const out=ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);
  // out.setContent("{444:123}");
  out.setContent(values);
  console.log(out);
  return  template.evaluate();
}
