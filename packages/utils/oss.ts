import OSS from 'ali-oss';
export default (ossConf) => {
	return new OSS(ossConf);
};
