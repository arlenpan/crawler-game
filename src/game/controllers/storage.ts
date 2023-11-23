const StorageController = (() => {
  return {
    save: (key: string, value: any) => {
      console.log('save');
    },
    load: (key: string) => {
      console.log('load');
    },
  };
})();

export default StorageController;
