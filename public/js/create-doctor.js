// Get the hospital and department dropdowns
const hospitalSelectEl = document.querySelector('#hospital')
const departmentSelectEl = document.querySelector('#department')

console.log(hospitalSelectEl)


async function fetchDepartments(event){
    // Fetch departments based on the selected hospital
    const response = await fetch(`/admin/departments/get-hospital/${event.target.value}`);

    // Convert the response from JSON
    const result = await response.json();

    console.log(result)

    departmentSelectEl.innerHTML = '' //clear previous choice
    // add department of selected hospital
    for(oneDepartment of result){
        const optionEl = document.createElement('option')
        optionEl.textContent = oneDepartment.name
        optionEl.value=oneDepartment._id
        departmentSelectEl.appendChild(optionEl)

    }
}
// Update departments when the hospital selection changes
hospitalSelectEl.addEventListener('change',fetchDepartments)