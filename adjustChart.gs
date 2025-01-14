// グラフのデータ範囲を調整して、最新のデータだけをグラフにするための関数群

// 指定されたグラフのデータ範囲を最新のデータだけに更新する
//    引数：グラフオブジェクト
//    戻り値：なし
//  
function adjustGraphRange(chart) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // 新しいデータ範囲を指定
  var newDataRange = sheet.getRange("A1:B1000"); // 必要な範囲を指定 
  // ここでは999個のデータをグラフ化するように設定 10分間隔のサンプリングで大体１週間分

  // グラフのビルダーを取得し、データ範囲を更新
  var chartBuilder = chart.modify();
  chartBuilder.clearRanges(); // 既存の範囲を削除
  chartBuilder.addRange(newDataRange); // 新しい範囲を追加

  // グラフのデータ範囲を設定し直すと、グリッド線の設定も変わってしまうので、主要なグリッド線だけ表示するように設定し直す
  chartBuilder.setOption('hAxis.gridlines', { count: 5 });  // 水平軸の主要グリッド線 count はグリッド線の数
  chartBuilder.setOption('hAxis.minorGridlines', { count: 0 }); // 水平軸の副グリッド線を非表示

  chartBuilder.setOption('vAxis.gridlines', { count: 5 }); // 垂直軸の主要グリッド線 count はグリッド線の数
  chartBuilder.setOption('vAxis.minorGridlines', { count: 0 }); // 垂直軸の副グリッド線を非表示
  
  // グラフを更新
  sheet.updateChart(chartBuilder.build());

  Logger.log("Chart range updated successfully.");

}

// シート内にあるグラフを「グラフ名」で探してグラフオブジェクトを返す
//   引数：グラフ名（文字列）
//   戻り値：グラフオブジェクト（指定した名前のグラフがシート内にあった場合）
//          null (指定した名前のグラフが存在しない場合)
// 
function getChartByTitle(targetTitle) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var charts = sheet.getCharts();
  Logger.log(targetTitle);

  for (var i = 0; i < charts.length; i++) {
    var chart = charts[i];
    var title = chart.getOptions().get('title');
    if (title === targetTitle) {
      return chart;
    }
  }
  return null; // 該当するグラフがない場合
}

// グラフのデータ範囲を再設定するために実際に外部から呼び出す関数
//   タイマなどで1日に1回実行する
// 
function chartRangeRenew(){
  // 現在アクティブなシート内にある’気温’と名前のついたグラフを探します。
  var chart = getChartByTitle('気温');
  if (chart) {
    Logger.log( chart.getOptions().get('title'));
    // 探したグラフのデータ範囲を再設定します。
    adjustGraphRange(chart);
  }
}


