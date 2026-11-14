(function(){
  var drawer=document.getElementById('drawer'),burger=document.getElementById('burger'),
      closeBtn=document.getElementById('drawerClose'),lastFocus=null;
  function openD(){lastFocus=document.activeElement;drawer.setAttribute('data-open','true');
    burger&&burger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';
    var f=drawer.querySelector('a,button');f&&f.focus();}
  function closeD(){drawer.setAttribute('data-open','false');burger&&burger.setAttribute('aria-expanded','false');
    document.body.style.overflow='';lastFocus&&lastFocus.focus();}
  burger&&burger.addEventListener('click',openD);
  closeBtn&&closeBtn.addEventListener('click',closeD);
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&drawer.getAttribute('data-open')==='true')closeD();
    if(e.key==='Tab'&&drawer.getAttribute('data-open')==='true'){
      var f=drawer.querySelectorAll('a,button'),first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }});
  window.addEventListener('resize',function(){if(window.innerWidth>1049&&drawer.getAttribute('data-open')==='true')closeD();});

  var SA={
    sa1:{t:'Лёгкая зачистка',s:'остаётся ржавчина в порах',
      l:['Удалены рыхлая ржавчина, отслаивающаяся краска и грязь.','В порах металла остаются тёмные пятна коррозии.','Под цинк не годится: покрытие ляжет на ржавчину и отойдёт.','Применяем, когда деталь всё равно пойдёт под замену или нужен быстрый осмотр.']},
    sa2:{t:'Sa 2',s:'тщательная, пятна до 33 %',
      l:['Остаются только прочно связанные с металлом тонкие пятна и разводы.','Допустимо для конструкций без ответственного покрытия.','Для кузовных панелей и рам берём следующую ступень.']},
    sa25:{t:'Sa 2½',s:'очень тщательная, разводы до 5 %',
      l:['Поверхность почти белая, допускаются лёгкие разводы не более чем на 5 % площади.','Шероховатость даёт цинку и грунту за что зацепиться.','Наша рабочая ступень под цинкование и покраску.']},
    sa3:{t:'Sa 3',s:'белый металл',
      l:['Однородный металлический блеск без пятен и окалины.','Нужна для ответственных узлов, сварных швов и дефектовки трещин.','Металл истончается сильнее, поэтому толщину контролируем до и после.']}
  };
  var swOut=document.getElementById('swOut');
  function paintSw(k){
    var d=SA[k];if(!d||!swOut)return;
    swOut.innerHTML='<h3>'+d.t+' · '+d.s+'</h3><ul>'+d.l.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>';
  }
  var swBtns=document.querySelectorAll('.sw__i');
  swBtns.forEach(function(b){
    b.addEventListener('click',function(){
      swBtns.forEach(function(x){x.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed','true');paintSw(b.getAttribute('data-k'));
    });
  });
  if(swBtns.length)paintSw(swBtns[0].getAttribute('data-k'));

  var CLEAN={rust_light:'Sa 2½',rust_deep:'Sa 3',paint:'Sa 2½',heat:'Sa 3',zinc_fail:'Sa 3'};
  var DET={
    panel:{n:'Панель кузова',zinc:true,note:'Тонкий металл: давление и зерно подбираем мягче, после цинка идёт грунт и покраска.'},
    frame:{n:'Рама, лонжерон, порог',zinc:true,note:'Силовой элемент: чистим с двух сторон и цинкуем стыки и сварные швы.'},
    disk:{n:'Колёсный диск',zinc:true,note:'Аккуратно с посадочными поверхностями и отверстиями под болты.'},
    beam:{n:'Мост, балка, рычаг',zinc:true,note:'Массивные детали: цинк по всей поверхности, включая торцы.'},
    gate:{n:'Ворота, ограждение',zinc:true,note:'После цинка обычно следует покраска: скажите цвет, подберём грунт.'},
    metal:{n:'Металлоконструкция',zinc:true,note:'Считаем по площади и доступу; сложные профили требуют больше времени.'},
    exhaust:{n:'Глушитель, выпуск',zinc:false,note:'Цинк на выпуске не применяем: высокая температура. Только очистка и термостойкое покрытие.'}
  };
  var pickDetail=document.getElementById('pickDetail'),pickState=document.getElementById('pickState'),
      pickOut=document.getElementById('pickOut'),pickWa=document.getElementById('pickWa');
  function paintPick(){
    if(!pickOut||!pickDetail||!pickState)return;
    var d=DET[pickDetail.value],c=CLEAN[pickState.value],s=pickState.options[pickState.selectedIndex].text;
    var steps=['Чистка струёй до степени '+c+' ('+d.n.toLowerCase()+').'];
    if(d.zinc)steps.push('Нанесение цинка сразу после очистки, пока металл не остыл и не отсырел.');
    else steps.push('Без цинка: подбираем термостойкое покрытие.');
    steps.push('Контроль: осмотр на просвет, проверка толщины покрытия, фото до и после.');
    steps.push(d.note);
    pickOut.innerHTML='<b>'+d.n+' · '+s+'</b><ol>'+steps.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ol>';
    if(pickWa){
      var msg='Заявка с сайта: '+d.n+', состояние — '+s.toLowerCase()+'. Рекомендация: '+c+(d.zinc?', с цинком':', без цинка')+'.';
      pickWa.href='https://wa.me/375333896110?text='+encodeURIComponent(msg);
    }
  }
  pickDetail&&pickDetail.addEventListener('change',paintPick);
  pickState&&pickState.addEventListener('change',paintPick);
  paintPick();

  var send=document.getElementById('sendForm');
  send&&send.addEventListener('click',function(e){
    e.preventDefault();
    var g=function(n){var el=document.querySelector('[name='+n+']');return el?el.value.trim():'';};
    var msg='Заявка с сайта Пескоструй и цинк: '+g('name')+' · '+g('tel')+' · деталь: '+g('detail')+' · задача: '+g('task');
    document.getElementById('formout').textContent='Открываем WhatsApp с готовым сообщением';
    window.open('https://wa.me/375333896110?text='+encodeURIComponent(msg),'_blank');
  });
})();
