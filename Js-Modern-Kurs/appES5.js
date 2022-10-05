//Course constructor -> Kurs constructor açıyoruz. Dışarıdan title,ins,image alacak.
function Course(title, instructor, image){  
    this.title = title;
    this.instructor = instructor;
    this.image = image;
}
//UI CONSTRUCTOR açıyoruz. Prototype olarak sonradan eklenen ve gerektiğinde kullanılan metodlar ekliyoruz.
function UI(){
}
UI.prototype.addCourseToList = function(course){
    const list = document.getElementById("course-list");
    var html = `
    <tr>
        <td><img src="img/${course.image}"/></td>
        <td>${course.title}</td>
        <td>${course.instructor}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
    </tr>
    `;
    list.innerHTML += html;
}
UI.prototype.clearControls= function(){
    const title = document.getElementById("title").value="";
    const instructor = document.getElementById("instructor").value="";
    const image = document.getElementById("image").value=""; 
}
UI.prototype.deleteCourse = function(element){ //Element dışarıdan target yani tıklananı alır. İçinde delete varsa aşağıdaki işlemler uygulanır.
    if(element.classList.contains("delete")){ //Class listesi içinde delete varsa (sadece silme butonunda var) işlem uygulanır.
        //Tr silinmesi lazım. a elementi td içinde o da tr içinde..
        element.parentElement.parentElement.remove();
    }
}
UI.prototype.showAlert = function(message,className){ //ClassName yine eklenecek.
    var alert = `
        <div class="alert alert-${className}">
            ${message}
        </div>
    `;

    const row = document.querySelector(".row");
    //beforeBegin, afterBegin, beforeEnd, afterEnd
    //Row etiketinin hemen üstüne eklemek için beforeBegin kullanılacaktır.
    row.insertAdjacentHTML('beforeBegin', alert);

    setTimeout(()=>{
        document.querySelector('.alert').remove();
    },3000); //setTimeOUT ile 5 sn sonra alert silinecek.
}

document.getElementById("new-course").addEventListener("submit", function(e){
    const title = document.getElementById("title").value;
    const instructor = document.getElementById("instructor").value;
    const image = document.getElementById("image").value; 

    //Create course object
    const course = new Course(title,instructor,image);
    //create UI
    const ui = new UI();

    if(title === '' || instructor ==='' || image ===''){
        ui.showAlert("Please complete the form !", "warning", );
    }
    else{
        //add course to list
        ui.addCourseToList(course); //ui üzerinden fonks tanımlanır. Dışarıdan course objesi bekler
        //clear course
        ui.clearControls();
        ui.showAlert("The course has been added", "success");
    }
    e.preventDefault();
});

document.getElementById("course-list").addEventListener('click',function(e){
    const ui = new UI();
    //if(!element.matches("a")) return; 

    ui.deleteCourse(e.target);
    ui.showAlert("The course has been deleted", "danger");
});