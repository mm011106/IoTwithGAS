// web app
// Postリクエストを受け付けた場合の処理
// 		リクエストに含まれるJSONデータをパースして処理
// 			sheet_name:データを追加するシート名
// 			temperature:データ本体

function doPost(e) {
  // 送信されてくるJSONデータから、要素を取り出す
  //  JSONデータがついていないPOSTではテストデータを使う
  try{
    var params = JSON.parse(e.postData.getDataAsString());
    Logger.log("Successfully Received JSON data.");
  }
  catch (error){
    Logger.log("No data found. Use test data.");
    // テスト用データ
    var params = JSON.parse('{"sheet_name":"sensor2","temperature":99.99, "humidity":10.00, "pressure": 1001.1}');
    // var params = JSON.parse('{"temperature":99.99, "humidity":10.00, "pressure": 1001.1}');
    // var params = JSON.parse('{"sheet_name":"sensor2","temperature":22.10}');
  }
  
  //  データの取り出し 
  // JSONのインデックス名と同じメンバー名で各データにアクセスします
  var sheet_name = params.sheet_name;   //"sheet_name"のデータを取り出す
  // シート名の指定がなければデフォルトのシート名にデータを追記する
  if (!sheet_name) {
    var sheet_name = 'sensor1';
  }
  var temperature = params.temperature;
  var humidity = params.humidity;
  var pressure = params.pressure;

  Logger.log(sheet_name);
  Logger.log(temperature);

  // データを追記するシートを読み出します。
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);

  //	指定したシートがない場合の処理;
  if (!sheet) {
    //  指定された名前でシートを作成し、ヘッダ行を追記（ヘッダ行は適宜変更してください）
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

  return;
}


// (1) GETリクエストを受け取ると doGet が実行される
function doGet() {
 
}
