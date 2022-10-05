//Course class
class Course{
    constructor(title, instructor, image){
        this.courseId = Math.floor(Math.random()*10000);   //Dışarıdan bilgi alarak değil. Sınıftan nesne türetildiğinde random sayı üretilmesi için.
        //Veri tabanı kullanmadığımız için bu yöntemi kullandık.
        this.title = title;
        this.instructor = instructor;
        this.image = image;
    }
}
//UI CLASS
class UI{
    addCourseToList(course){ //Metod tanımlanıyor.. DIşarıdan course alıyor. Ekleme ile aşağıda yönlendiriyor.
        const list = document.getElementById("course-list");
        var html = `
        <tr>
            <td><img src="img/${course.image}"/></td>
            <td>${course.title}</td>
            <td>${course.instructor}</td>
            <td><a href="#" data-id="${course.courseId}" class="btn btn-danger btn-sm delete">Delete</a></td>
        </tr>
        `;
        list.innerHTML += html;
    }

    clearControls(){
        const title = document.getElementById("title").value="";
        const instructor = document.getElementById("instructor").value="";
        const image = document.getElementById("image").value=""; 
    }

    deleteCourse(element){
        if(element.classList.contains("delete")){ //Class listesi içinde delete varsa (sadece silme butonunda var) işlem uygulanır.
            //Tr silinmesi lazım. a elementi td içinde o da tr içinde..
            element.parentElement.parentElement.remove();
            return true;
        }
    }

    showAlert(message, className){
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
}

class Storage{
    static getCourses(){ //Localstorageden bilgileri alıp getirecek
        let courses;
        if(localStorage.getItem('courses')===null){
            courses = [];
        }
        else{
            courses =JSON.parse(localStorage.getItem("courses"));
        }
        return courses;
    }

    static displayCourses(){ //Bilgileri ekranda gösterecek.
        const courses = Storage.getCourses(); //Yukarıdaki getCourses'i alacak.
        courses.forEach(course => {
            const ui = new UI(); 
            ui.addCourseToList(course); //Kursları tek tek alıyor get ile ve addCourseToList ile dağıtıyor.
        });
    }

    static addCourse(course){ // Dışarıdan kurs bilgisi alsın ve eklesin
        const courses = Storage.getCourses();
        courses.push(course); //Kurs eklenir.
        localStorage.setItem('courses',JSON.stringify(courses)); //Önceki isimle eklediğimiz için önceki silinecek.
        //Ve onun yerine son eklenen liste eklenecek. Aynı isimde obje oluşturuyoruz.. Son eklenen güncel kayıt olmuş oluyor.
    }

    static deleteCourse(element){ //Kurs objesini alsın ve localstorageden bulup silmesi için. E target gönderiliyor.
        if(element.classList.contains('delete')){
            const id = element.getAttribute('data-id');
            const courses = Storage.getCourses();
            courses.forEach((course,index)=>{
                if(course.courseId == id){
                    courses.splice(index,1); //Hangi indextey ondan itibaren 1 eleman sil.
                }
            });
            localStorage.setItem('courses',JSON.stringify(courses));
        }
    }
}

document.addEventListener('DOMContentLoaded',Storage.displayCourses); //Storagede kurs varsa direkt ekranda gözükecek

document.getElementById("new-course").addEventListener("submit", function(e){
    const title = document.getElementById("title").value;
    const instructor = document.getElementById("instructor").value;
    const image = document.getElementById("image").value; 

    const course = new Course(title,instructor,image);     //Create course object
    const ui = new UI();    //create UI

    if(title === '' || instructor ==='' || image ===''){
        ui.showAlert("Please complete the form !", "warning", );
    }
    else{
        //add course to list
        ui.addCourseToList(course); //ui üzerinden fonks tanımlanır. Dışarıdan course objesi bekler
        
        //saveto LS
        Storage.addCourse(course);

        ui.clearControls(); //clear course
        ui.showAlert("The course has been added", "success");
    }
    e.preventDefault();
});

document.getElementById("course-list").addEventListener('click',function(e){
    const ui = new UI();
    if(ui.deleteCourse(e.target)==true) {
    //delete from LS
    Storage.deleteCourse(e.target);
    ui.showAlert("The course has been deleted", "danger");
    }
});