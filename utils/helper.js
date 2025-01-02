export const base64ToBlob = (base64String, mimeType) => {
  try {
    // Memastikan base64String memiliki prefix yang sesuai
    const base64Data = base64String.split(',')[1];

    if (!base64Data) {
      throw new Error('Invalid base64 data');
    }

    // Mengonversi base64 menjadi byte characters
    const byteCharacters = atob(base64Data);

    // Membagi byte characters menjadi array byte per 1024 karakter
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    // Menggabungkan byteArrays menjadi satu Blob
    return new Blob(byteArrays, { type: mimeType });
  } catch (error) {
    console.error('Error converting base64 to Blob:', error);
    throw error;
  }
};