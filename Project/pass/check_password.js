function test() {
    var p1 = document.getElementById('password1').value;
    var p2 = document.getElementById('password2').value;
      
	if(p1.length < 6) {
        alert('입력한 글자가 6글자 이상이어야 합니다.');
        return false;
    }
          
    if( p1 != p2 ) {
		alert("비밀번호불일치");
        location.href="3b.html";
        return false;
    } else{
         alert("환영합니다!");
         console.log(location.href);
         location.href = '../main/f.html'
         return true;
    }
}

