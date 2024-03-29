const app = Vue.createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'iris831206',
      products: [],
      tempProduct: {},
      isNew: false, //判斷是否為新增產品
      modalProduct: null,
      delProductModal: null,
    };
  },
  methods: {
    checkLogin() {
      //驗證登入
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    getData() {
      //取得資料
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },

    updateProduct() {
      //新增產品
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';
      //編輯產品
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }
      axios[http](url, { data: this.tempProduct })
        .then((res) => {
          this.getData(); //重新渲染產品列表
          this.modalProduct.hide(); //關掉Modal
          this.tempProduct = {}; //清除欄位
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    delProduct() {
      //刪除產品
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(url, { data: this.tempProduct })
        .then((res) => {
          this.getData();
          this.delProductModal.hide();
          this.tempProduct = {};
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    openModal(status, item) {
      if (status === 'new') {
        this.tempProduct = {
          imgUrl: [],
        };
        this.isNew = true;
        this.modalProduct.show();
      } else if (status === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        this.modalProduct.show();
      } else if (status === 'del') {
        this.tempProduct = { ...item };
        this.delProductModal.show()

      }

    },


  },

  mounted() {
    //實體化BS modal
    this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
    this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal);

    //將token存到cookie以進行驗證
    const myCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common['Authorization'] = myCookie;
    this.checkLogin();

  },

})

app.mount('#app') 