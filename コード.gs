function doPost(e) {

  // var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sensor1');
  
  // 送信されてくるJSONデータ　{"item":"name"}　から、要素を取り出す
  var params = JSON.parse(e.postData.getDataAsString());
  // var temp_1 = params.temp_1;
  // var temp_2 = params.temp_2;
  var item = params.item;
  var sheet_name = params.sheet_name;
  console.log(sheet_name);
  console.log(item);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
  if (!sheet) {
   //　指定したシートがない場合の処理;
   addSheet(sheet_name);
   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
  }

  // データをシートに追加
  sheet.insertRows(2,1);  // 2行1列目に列を挿入する
  sheet.getRange(2, 1).setValue(new Date());     // 受信日時を記録
  // sheet.getRange(2, 2).setValue(temp_1);     // temp_1を記録
  // sheet.getRange(2, 3).setValue(temp_2);     // temp_2を記録
  sheet.getRange(2, 2).setValue(item);     // temp_2を記録
  sheet.getRange(2, 3).setValue(sheet_name);     // temp_2を記録

  return HtmlService.createHtmlOutput('<b>Got it</b>');
  // return ContentService.createTextOutput("受付けました。");
}

function addSheet(newSheetName='addsheet_1') {
  // アクティブなスプレッドシートを取得
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // 追加するシートの名前を指定
  // var newSheetName = "New Sheet Name";

  // 同じ名前のシートが存在しないか確認
  if (!spreadsheet.getSheetByName(newSheetName)) {
    // 新しいシートを作成
    spreadsheet.insertSheet(newSheetName);
    Logger.log("Sheet added successfully: " + newSheetName);
  } else {
    Logger.log("Sheet with the name '" + newSheetName + "' already exists.");
  }
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
