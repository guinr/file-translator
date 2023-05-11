const app = new Vue({
  el: '#app',
  data() {
    return {
      file: null,
      fileName: null,
      fileUploading: false,
      fileUploaded: false,
      downloadUrl: '',
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async submitForm() {
      this.fileUploading = true;
      this.fileUploaded = false;
      const formData = new FormData();
      formData.append('file', this.file);
      this.fileName = this.file.name;
      try {
        const response = await axios.post('/translate', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const blob = new Blob([response.data], { type: 'text/plain' });
        this.fileUploading = false;
        this.fileUploaded = true;
        this.downloadUrl = window.URL.createObjectURL(blob);
      } catch (error) {
        console.error(error);
        this.fileUploading = false;
      }
    },
  },
});
