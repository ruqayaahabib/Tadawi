const hospitalSelectEl = document.querySelector('#hospital')
const departmentSelectEl = document.querySelector('#department')

console.log(hospitalSelectEl)


async function fetchDepartments(event){
    const response = await fetch(`/admin/departments/get-hospital/${event.target.value}`);

    const result = await response.json();

    console.log(result)

    for(oneDepartment of result){
        const optionEl = document.createElement('option')
        optionEl.textContent = oneDepartment.name
        optionEl.value=oneDepartment._id
        departmentSelectEl.innerHTML = ''
        departmentSelectEl.appendChild(optionEl)

    }
}

hospitalSelectEl.addEventListener('click',fetchDepartments)