const moduleRepository = require("../repositories/moduleRepository")
const courseRepository = require("../repositories/courseRepository")

const moduleService = {
    async createModule(moduleData, files) {
        const { courseId, title, description } = moduleData;
    
        if (!files.pdf) {
            throw new Error("PDF file is required");
        }
    
        const pdfPath = files.pdf.path; // Access `path` safely
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
            throw new Error("Invalid module ID");
        }
        return await moduleRepository.deleteModuleById(moduleId);
    },

    async editModule(moduleId, moduleData, files) {
        if (!moduleId) {
            throw new Error("Invalid module ID");
        }
    
        const updateFields = {
            ...moduleData,
            ...(files.pdf && { pdfPath: files.pdf.path }), // Use `path` directly, as the file object itself is passed
            ...(files.video && { videoPath: files.video.path }),
        };
    
        return await moduleRepository.updateModule(moduleId, updateFields);
    },    

    async getModuleData(moduleId) {
        const moduleData = await moduleRepository.findModuleById(moduleId);

        if (!moduleData) {
            throw new Error('Module not found');
        }

        return moduleData;
    }


}

module.exports = moduleService