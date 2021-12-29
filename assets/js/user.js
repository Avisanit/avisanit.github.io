function playClick() {
    let currUser = prompt("Введите имя пользователя:", "Anon");
    if (currUser == null || currUser == "") {
        alert('Для того чтобы начать играть нужно ввести имя!');
    } else {
        localStorage.setItem('currUser', currUser);
        window.location.href = "pages/level1.html";
    }
}