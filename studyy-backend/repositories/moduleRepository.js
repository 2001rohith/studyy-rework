const Module = require("../models/moduleModel")

const moduleRepository = {
    async findModulesByCourse(courseId) {
        return await Module.find({ course: courseId });
    },

    async createModule(moduleData) {
        const newModule = new Module(moduleData);
        return await newModule.save();
    },

    async deleteModuleById(moduleId) {
        const module = await Module.findByIdAndDelete(moduleId);
        if (!module) {
            throw new Error("Module not found");
        }
        return module;
    },

    async updateModule(moduleId, updateData) {
        const updatedModule = await Module.findByIdAndUpdate(moduleId, updateData, { new: true });
        if (!updatedModule) {
            throw new Error("Module not found");
        }
        return updatedModule;
    },

    async findModuleById(moduleId) {
        return await Module.findById(moduleId);
    }

}

module.exports = moduleRepository