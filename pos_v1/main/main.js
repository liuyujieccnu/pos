'use strict';

//创建一个新的商品对象
function item(barcode,name,unit,price,count,promotion,total){
  this.barcode=barcode;
  this.name=name;
  this.unit=unit;
  this.price=price;
  this.count=count;
  this.promotion=promotion;
  this.total=total;
}

//累计节省的金额
let promotionPrice=0;

//生成购买商品详情列表并计算价格（原价）
function selectedItems(allItems,input){
  let selecteditems = new Array;
  let select0 = new Array;//哈希数组用来保存barcode：count；
  for(let i=0;i<input.length;i++){
    let tag=input[i].split('-');
    let con=0;
    //判断count是需要加的数量
    if(tag.length > 1){
      con=Number(tag[1]);
    }else{
      con=1;
    }
    //生成barcode：count；
    if(select0[tag[0]] == null){
      select0[tag[0]]=con;
    }else{
      select0[tag[0]]+=con;
    }
  }
  //生成购买商品的列表
  for(let i in select0){
    for(let j=0;j<allItems.length;j++){
      if(i === allItems[j].barcode){
        selecteditems.push(new item(allItems[j].barcode,allItems[j].name,allItems[j].unit,allItems[j].price,select0[i],'',allItems[j].price*select0[i]));
      }
    }
  }
  return selecteditems;
}

//查询是否有优惠信息
function checkPromotions(Promotions,items) {
  for(let i=0;i<items.length;i++){
    for(let j=0;j<Promotions.length;j++){
      if(Promotions[j].barcodes.indexOf(items[i].barcode)!=-1){
        items[i].promotion=Promotions[j].type;
      }
    }
  }
  return items;
}

//buyTwoGetOneFree函数实现
function buyTwoGetOneFree(item) {
  let temp = item.total;
  item.total=(item.count-Math.floor(item.count/3))*item.price;
  promotionPrice+=temp-item.total;
  return item;
}

//实现优惠
function prompt(items) {
  for(let i=0;i<items.length;i++){//查询不同种类优惠调用相关函数
    if(items[i].promotion==='BUY_TWO_GET_ONE_FREE'){
      items[i]=buyTwoGetOneFree(items[i]);
    }
  }
  return items;
}

//打印小票
function print(items){
  let totalPrice=0;
  let str='***<没钱赚商店>收据***\n';
  for(let i=0;i<items.length;i++){
    totalPrice+=items[i].total;
  }
  for(let i=0;i<items.length;i++){
    str+='名称：'+items[i].name+'，数量：'+items[i].count+items[i].unit+'，单价：'
      +items[i].price.toFixed(2)+'(元)，小计：'
      +items[i].total.toFixed(2)+'(元)\n';
  }
  str+='----------------------\n总计：'+totalPrice.toFixed(2)+'(元)\n'
    +'节省：'+promotionPrice.toFixed(2)+'(元)\n**********************';
  console.log(str);
}


//打印收据的主函数
function printReceipt(tags){
  let selected_items = selectedItems(loadAllItems(),tags);
  selected_items = checkPromotions(loadPromotions(),selected_items);
  selected_items = prompt(selected_items);
  print(selected_items);
}
