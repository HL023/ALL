function butt() {
    document.querySelector("#money").value = Number(document.querySelector("#money").value) - 20000
    number_while()
}

function number_while(){
    setInterval(number_while, 1);
    const rand = Math.floor(Math.random() * 100001)
    document.querySelector("#rand").value = rand
}

function show(){
    document.querySelector("#show").value = document.querySelector("#rand").value
    document.querySelector("#money").value = Number(document.querySelector("#money").value) + Number(document.querySelector("#rand").value)
    console.log(document.querySelector("#rand").value)
}

function yes(){
    document.querySelector("#show").type = "date"
}