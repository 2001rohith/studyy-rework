const moduleRepository = require("../repositories/moduleRepository")
const courseRepository = require("../repositories/courseRepository")
const constants = require("../helpers/constants")

const moduleService = {
    async createModule(moduleData, files) {
        const { courseId, title, description } = moduleData;
    
        if (!files.pdf) {
            throw new Error(constants.PDF_REQUIRED);
        }
    
        const pdfPath = files.pdf.path;
        const videoPath = files.video?.path || null;
    
        const module = {
            course: courseId,
            title,
            description,
            pdfPath,
            videoPath,
        };
    
        const newModule = await moduleRepository.createModule(module);
    
        await courseRepository.addModuleToCourse(courseId, newModule._id);
    
        return newModule;
    },
    
    async deleteModule(moduleId) {
        if (!moduleId) {
            throw new Error(constants.INVALID_MODULEID);
        }
        return await moduleRepository.deleteModuleById(moduleId);
    },

    async editModule(moduleId, moduleData, files) {
        if (!moduleId) {
            throw new Error(constants.INVALID_MODULEID);
        }
    
        const updateFields = {
            ...moduleData,
            ...(files.pdf && { pdfPath: files.pdf.path }),
            ...(files.video && { videoPath: files.video.path }),
        };
    
        return await moduleRepository.updateModule(moduleId, updateFields);
    },    

    async getModuleData(moduleId) {
        const moduleData = await moduleRepository.findModuleById(moduleId);

        if (!moduleData) {
            throw new Error(constants.MODULE_NOT_FOUND);
        }

        return moduleData;
    }


}

module.exports = moduleService