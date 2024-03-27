import Styles from '../../pages/Categories.module.css'

function CategoriesForm ({rendered, setRender}) {

    const url = "http://localhost/routers/categories.php"

    const isValidFields = () => {
        if (document.getElementById("categoryTax").value > 0) {
          return document.getElementById("categoryRegister").reportValidity()
        } else {
          alert('The value of "tax" must be higher than 0')
        }
      }
    
    const clearFields = () => {
        const fields = document.querySelectorAll(".formField")
        fields.forEach((field) => (field.value = ""))
    }
      
    const fetchForm = async() => {
        const form = document.getElementById("categoryRegister")
        const formData = new FormData(form)
        const data = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          body: formData
        })
        const response = await data.json()
    }

    const saveCategory = async(e) => {
            e.preventDefault()
        if (isValidFields()) {
          await fetchForm()
          setRender(!rendered)
          clearFields()
        }
    }

    return (
        <form id="categoryRegister" onSubmit={saveCategory}>
            <div className={Styles.catInput}>
                <input type="text" id="categoryName" className="formField" placeholder="CategoryName:" name="categoryName" required/>
            </div>
            <div className={Styles.catInput}>
                <input type="number" id="categoryTax" name="categoryTax" className="formField" placeholder="Tax:" required/>
            </div>
            <div className={Styles.addCatButton}>
                <button type="submit" value="submit" id="addCat">Add Category</button>
            </div>
        </form>
    )
    
}

export default CategoriesForm