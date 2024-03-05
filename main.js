let pieces=document.querySelectorAll('span');
let selected=null //index of the board
let promotedshape='♛';
let forceclick=0;
let forcevirt=0;
let availchecks=[]
let resultofchecks=[]
let container=document.querySelector('.container');
let whowinelement=document.createElement('p');
let table=document.querySelector('table')

//let goal=[];
let player1=1//white
let player2=2;//black
let avail=[]
let playing=0;
let forcingmove=0;
onload=()=>{
    whowinelement.innerText=`Turn of ${curplayer==1?"White Player":"Black Player"}`;
    container.appendChild(whowinelement)
}
class player{
    constructor(color, num,curposition,promoted=0){
        this.color=color==0?'black':'white';
        this.num=num
        this.promoted=promoted
        this.curposition=curposition
    }

}
let curplayer=player1;
let board=[ 0,0,0,0,0,0,0,0,//0-7 [7/8,7%8]
            0,0,0,0,0,0,0,0,//8-15 //9  0 2
            0,0,0,0,0,0,0,0,//16-23
            0,0,0,0,0,0,0,0,//24-31
            0,0,0,0,0,0,0,0,//32-39
            0,0,0,0,0,0,0,0,//40-47
            0,0,0,0,0,0,0,0,//48-55
            0,0,0,0,0,0,0,0//56-63
    ];
   for (let i =1;i<=23;i+=2){
    if(i==9)
    i--
    else if(i==16){
        i++
    }
    board[i]=new player(0,2,i);
    
   }
   for (let i =40;i<=62;i+=2){
    if(i==48)
    i++
    else if(i==57){
        i--;
    }
    board[i]=new player(1,1,i);

   }
function convert2dind(row,col){
    return row*8+col;
}
function convert1dind(ind){
    return [Math.floor(ind/8),ind%8]
}
function isEdge(selectedP){
if (selectedP%8==7){
    if(selectedP==7){
        return 7//corner top right

    }
    else if (selectedP==63){
        return 63 //corner bottom right
    }////////////////////////////////////////////////////////////////////////
    return 1;//right for white
}
else if(selectedP%8==0){
    if(selectedP==0){
        return -7 //corner top left

    }
    else if (selectedP==56){
        return -63 //corner bottom left
    }
    return -1;//left for white
}
else if (selectedP>0&&selectedP<7){
return 3; //top
}
else if (selectedP>56&&selectedP<63){

return -3 //bottom
}
else return 0 //is not edge
}
function diagonals(cell){//cell is index of 1D
   edge=isEdge(cell);
   result=[]
   x=convert1dind(cell);
   row=x[0]
   col=x[1]
   if (edge==0){
    //[row,col]=convert1dind(cell);
    result.push(convert2dind(row-1,col-1),convert2dind(row-1,col+1),convert2dind(row+1,col-1),convert2dind(row+1,col+1));
    
   }
   else if(edge==-1){
    result.push(convert2dind(row-1,col+1),convert2dind(row+1,col+1));
   }
   else if(edge ==-63){
    result.push(convert2dind(row-1,col+1));
   }
   else if(edge==-7){
    result.push(convert2dind(row+1,col+1));
   }
   else if (edge==1){
    result.push(convert2dind(row+1,col-1),convert2dind(row-1,col-1));
   }
   else if (edge==63){
    result.push(convert2dind(row-1,col-1));
   }
   else if (edge==7){
        result.push(convert2dind(row+1,col-1));
    }
    else if (edge==3){
        result.push(convert2dind(row+1,col-1),convert2dind(row+1,col+1));
    }
    else if (edge==-3){
        result.push(convert2dind(row-1,col-1),convert2dind(row-1,col+1));
    }
    return result;
}
function deleteelement(arr,index){
    arr=arr.slice(0,index).concat(arr.slice(index+1))
    return arr
}
//inc diagonal +=9
//dec diagonal -=9

function whowin(myboard){
    let black=0;
    let white=0;
    for(let i of myboard){
        if (i!=0&&i.num==player1)
        white++;
        else if (i!=0 && i.num==player2)
        black++
    
    }
    if (black==0&&white!=0){
        return 1;
    }
    
    else if (black!=0&&white==0){
        return -1
    }
    else{
        return -2;
    }
    



}

function availofchecks(curi,myboard,result=[],curp){
    //iflag=0;
   // if(myboard[curi].promoted==0){
        let availdiags=diagonals(curi);
        for (let i of availdiags){
            if (myboard[i]!=0&&myboard[i].num!=myboard[curi].num&&myboard[curi]!=0&&isEdge(i)==0 ){
                let dim=convert1dind(curi)
                let row=dim[0]
                let col=dim[1];
                if (curi<i &&(myboard[curi].promoted==0?curp==2:1)){
                    
                    if ((i-curi)*2==18&&row+2<=7&&col+2<=7&&myboard[curi+18]==0){//row+2 col+ 2 ,,row+2 col-2
                        let mb=myboard.slice()
                        mb[curi+18]=myboard[curi];
                        mb[curi+9]=0;
                        mb[curi]=0;
                        
                        result.push(curi+18);
                        
                        
                       
                        resultofchecks.push(availofchecks(curi+18,mb.slice(),result.slice(),curp));
                        result.pop()
                    }
                    else if ((i-curi)*2==14&&row+2<=7&&col-2>=0&&myboard[curi+14]==0){
                        let mb=myboard.slice()
                        mb[curi+14]=mb[curi];
                        mb[curi+7]=0;
                        mb[curi]=0;
                        result.push(curi+14);/////////
                        
                        
                       
                        resultofchecks.push(availofchecks(curi+14,mb.slice(),result.slice(),curp));/////////
                        result.pop()
                    }
                    else{
                        continue
                    }
                }
                else if (curi>i&&(myboard[curi].promoted==0?curp==1:1)){
                    if ((curi-i)*2==18&&row-2>=0&&col-2>=0&&myboard[curi-18]==0){//row-2 col-2    row-2 col+2
                        let mb=myboard.slice()
                        mb[curi-18]=mb[curi]
                        mb[curi-9]=0;
                        mb[curi]=0
                        result.push(curi-18);
                        
                        
                       
                        resultofchecks.push(availofchecks(curi-18,mb.slice(),result.slice(),curp));
                        result.pop()
                    }
                    else if ((curi-i)*2==14&&row-2>=0&&col+2<=7&&myboard[curi-14]==0){
                        let mb=myboard.slice()
                        mb[curi-14]=mb[curi];
                        mb[curi-7]=0;
                        mb[curi]=0;
                       // result.push(curi-14);
                       result.push(curi-14);
                        
                        
                       
                       resultofchecks.push(availofchecks(curi-14,mb.slice(),result.slice(),curp));
                       result.pop()
                    }
                    else continue
                }
            }
        }

    return result;


   // }

   

}
function availofpiece(sq,myboard,curp=curplayer){//sq is an index of the board array
if (myboard[sq]==0)
return []

    //if (myboard[sq].promoted==0){
        let result=[]
        //let n=[]
        let av=diagonals(myboard[sq].curposition);
        if (curp==player1){
        if (myboard[sq].promoted==0)    
        for (let i of av){
            if (i<myboard[sq].curposition){
                if (myboard[i]==0)
                result.push(i)
            }
        }
        else{
            for (let i of av){
                
                    if (myboard[i]==0)
                    result.push(i)
                
            }
        }
        
        availofchecks(sq,myboard.slice(),[],curp);
     
        if (resultofchecks.length!=0){
            for (let i in resultofchecks){
                if (resultofchecks[i].length==1){
                    for(let j of resultofchecks){
                        if (j.length>1&&j[0]==resultofchecks[i][0]){
                            resultofchecks= deleteelement(resultofchecks,i);
                            break
                        }
                    }
                }
            }
            result =resultofchecks.slice()
            resultofchecks=[]
            //if(virt==0)
            forcingmove=1;
            forcevirt=1
        }
        return result;
       
    }
    else{
        if (myboard[sq].promoted==0) 
        for (let i of av){
            if (i>myboard[sq].curposition){
                if (myboard[i]==0)
                result.push(i)
            }
             }
        else{
            for (let i of av){
                
                    if (myboard[i]==0)
                    result.push(i)
                
                 }
        }     

        
        availofchecks(sq,myboard.slice(),[],curp);
        if (resultofchecks.length!=0){
            for (let i in resultofchecks){
                if (resultofchecks[i].length==1){
                    for(let j of resultofchecks){
                        if (j.length>1&&j[0]==resultofchecks[i][0]){
                            resultofchecks= deleteelement(resultofchecks,i);
                            break
                        }
                    }
                }
            }
            //if(virt==0)
            forcingmove=1;
            forcevirt=1;
            result =resultofchecks.slice()
            resultofchecks=[]
             
        }
        return result;
    }
  //  }

}
// function delay(ms){
//     c=new Date().getSeconds()*1000+ms
//     while(1){
//         g=new Date()
//         if(g.getSeconds()*1000+g.getMilliseconds()==c)
//         return
//     }
// }
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

 async function play(select,goal,myboard=board){
    if (goal==-1 || square(...convert1dind(select)).children.length==0 ||square(...convert1dind(goal)).children.length==1 ||board[select].num!=curplayer)
    return 
    playing=1
    if (forcingmove==1){
        avv=[]
        for (let j of avail)
            if (j[j.length-1]!=goal)
            continue
            else{
                avv=j;
                break
            }
    if (avv.length==0)return
    for (let i of avv){
        
        myboard[i]=myboard[select];
        myboard[i].curposition=i
        myboard[select]=0
        myboard[i+(select-i)/2]=0
        // deleteelement(myboard,select);
        // deleteelement(myboard,i+(select-i)/2)
       // square(...convert1dind(select)).classList.remove('selected')
        for (let j of (avail==undefined?[]:avail)){
            for (let y of j)
            square(...convert1dind(y)).classList.remove('avail');
    
        }
        square(...convert1dind(i+(select-i)/2)).removeChild(square(...convert1dind(i+(select-i)/2)).children[0])
         square(...convert1dind(i)).appendChild(square(...convert1dind(select)).children[0])
        //i+(selected-i)/2
        forcingmove=0
        select=i;
        for (let i of availchecks)
        square(...convert1dind(i)).classList.remove('selected')
        await delay(80)
    }
forceclick=0;
}
    else{
        
        if (!avail.includes(goal))
            return
        
    myboard[goal]=myboard[select];
    myboard[goal].curposition=goal
    myboard[select]=0
    // deleteelement(myboard,select);
    
    square(...convert1dind(select)).classList.remove('selected')
    square(...convert1dind((select+2<=63?select+2:select))).classList.remove('selected')
    square(...convert1dind((select+8<=63?select+8:select))).classList.remove('selected')
    square(...convert1dind((select-2>=0?select-2:select))).classList.remove('selected')
    square(...convert1dind((select-8>=0?select-8:select))).classList.remove('selected')

    for (let i of avail){
        square(...convert1dind(i)).classList.remove('avail');

    }
    
    square(...convert1dind(goal)).appendChild(square(...convert1dind(select)).children[0])
    playing=0;
}
if ((curplayer==player1&& [0,1,2,3,4,5,6,7].includes(goal))||(curplayer==player2&& [56,57,58,59,60,61,62,63].includes(goal))){
    myboard[goal].promoted=1;
    square(...convert1dind(goal)).children[0].innerText=promotedshape;
    avail=[]

}

   curplayer=curplayer==player1?player2:player1
   avail=[]
   af=[]
   availchecks=[]

   

   for (let i of board){
        if (i!=0&&i.num==curplayer){
        a=availofpiece(i.curposition,board.slice())
        avail=a==undefined?[]:a
        if (typeof (avail[0])=='object'){
            af.push(...avail.slice())
            //square(...convert1dind(i.curposition)).children[0].click();
            //selected=i.curposition
            availchecks.push(i.curposition)

            for (let b of avail){
                //(e)=>{play(availchecks[availchecks.length-1],b[b.length-1])}
                for (let u of b)
                square(...convert1dind(u)).onclick=(function(avc,bb){
                    return function(){
                        play(avc,bb)
                    }

                })(availchecks[availchecks.length-1],b[b.length-1])
               }
            //square() 
            square(...convert1dind(i.curposition)).classList.add('selected');  
            for (let t of avail){
    
                for (let j of t)
                square(...convert1dind(j)).classList.add('avail');
               }
            forceclick=1/////////////
            //return
            
        }
        
    }

   }
  let WW=whowin(board)
if (WW==1){

    whowinelement.innerText='White Player Won';
    container.appendChild(whowinelement)
}
else if (WW==0){
    whowinelement.innerText='Draw';
    container.appendChild(whowinelement)
}
else if(WW==-1){
    whowinelement.innerText='Black Player Won';
    container.appendChild(whowinelement)
}
else{
    whowinelement.innerText=`Turn of ${curplayer==1?"White Player":"Black Player"}`;
    container.appendChild(whowinelement)
}

   avail=af.slice()
playing=0
//console.log(minmax(JSON.parse(JSON.stringify(myboard)),curplayer))

}
function removefromboard(row,col){
    s=square(row,col);
    if (s.children.length!=0)
    s.removeChild(s.children[0])
    else return -1

}

function square(row,col){
    return document.querySelectorAll('tr')[row].children[col]
}

onclick=function(e){
    //if (avail.length!=0)return
    if(forceclick)return
    if(!playing&&e.target.localName!='span'||(e.target.localName=='span'&&e.target.classList[0]==((curplayer==player1)?'black':'white'))){
    selected=null;
    if (forcingmove&& typeof(avail[0])=='object')
    for (let p of avail){
        for (let w of p)
        square(...convert1dind(w)).onclick=null
     }
     else{
        for (let p of avail){
            square(...convert1dind(p)).onclick=null
        }
     }
     
     forcingmove=0;
     avail=[]
       for (let k of document.querySelectorAll('td')){
        if (k.classList.contains('avail')){
            k.classList.remove('avail')
            
        }
        k.classList.remove('selected')
   }

    }
   
}


let clicked=function(e){
        if (forceclick)return;
    selected =Array.from(document.querySelectorAll('td')).indexOf(e.target.parentElement);
    if (board[selected].num!=curplayer)
    return
//    console.log(selected)
    for (let p of avail){
       square(...convert1dind(p)).onclick=null
    }
    forcingmove=0
    a=availofpiece(selected,board.slice())
    avail=a==undefined?[]:a
   
   for (let k of document.querySelectorAll('td')){
    if (k.classList.contains('avail')){
        k.classList.remove('avail')
        
    }
    k.classList.remove('selected')
   }
   square(...convert1dind(selected)).classList.add('selected')
   if (forcingmove && typeof(avail[0])=='object')
   for (let t of avail){
    
    for (let j of t)
    square(...convert1dind(j)).classList.add('avail');
   }
   else{
    for (let j of avail)
    square(...convert1dind(j)).classList.add('avail');
   }
   if (forcingmove&& typeof(avail[0])=='object')
   for (b of avail){
    for (let u of b)
    square(...convert1dind(u)).onclick=(e)=>{play(selected,Array.from(document.querySelectorAll('td')).indexOf(e.target))}
   }
   else{
    for (let u of avail)
    square(...convert1dind(u)).onclick=(e)=>{play(selected,Array.from(document.querySelectorAll('td')).indexOf(e.target))}
   }
    
}

// AI------------------------------------------
function availOfAllPieces(myboard,curp){
    let result=[]
    let avforce=[]
    let avnmove=[]
    let avpiece=[]
for (let i of myboard){
    if (i!=0&&i.num==curp){
        avpiece=availofpiece(i.curposition,myboard.slice(),curp,1)
        if (avpiece.length!=0){
        if (typeof(avpiece[0])!='object'){
        avnmove.push([i,avpiece])
        }
        else{
        avforce.push([i,avpiece]);
        }
        }
        
    }
}
if (avforce.length==0){
result=avnmove
}
else{
result=avforce
}
return result
}


function playvirt(myboard,select,goal,myavail){
    if (forcevirt==1){
        avv=[]
        for (let j of myavail)
            if (j[j.length-1]!=goal)
            continue
            else{
                avv=j;
                break
            }
    if (avv.length==0)return
    for (let i of avv){
        
        myboard[i]=myboard[select];
        myboard[i].curposition=i
        myboard[select]=0
        myboard[i+(select-i)/2]=0
        
      
        select=i;
        
        
    }
forcevirt=0
}
    else{
        
        if (!myavail.includes(goal))
            return
        
    myboard[goal]=myboard[select];
    myboard[goal].curposition=goal
    myboard[select]=0

}
if ((curplayer==player1&& [0,1,2,3,4,5,6,7].includes(goal))||(curplayer==player2&& [56,57,58,59,60,61,62,63].includes(goal))){
    myboard[goal].promoted=1;

    myavail=[]

}


   myavail=[]
   af=[]
   availchecks=[]

}
function extavail(ar){

    return ar[1]
}//extractiong avail from availofall
function minmax(myboard,curp){
   
    let rest=availOfAllPieces(myboard.slice(),curp);
    let n=[] 
    let score=null;
    let tryboard;
    for(let i of rest){
        let curavail=extavail(i);
        for (let j of curavail){
            tryboard =JSON.parse(JSON.stringify(myboard));
            if (typeof(j[0])=='object')
            playvirt(tryboard,i[0].curposition,j[j.length-1],curavail)
            else{
                playvirt(tryboard,i[0].curposition,j,curavail)
            }
            score=whowin(tryboard);
            if(score!=-2){
                
                return score
            }
            n.push(minmax(JSON.parse(JSON.stringify(tryboard)),(curp==player1?player2:player1)));
        
            
            tryboard =JSON.parse(JSON.stringify(myboard));
        }
    }
   if (curp==player1){
    return Math.max(...n)
   }
   else{
    return Math.min(...n)
   }

}

