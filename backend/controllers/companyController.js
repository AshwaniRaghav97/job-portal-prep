import Company from '../models/Company.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    // Attach active job count to each company
    const companiesWithCount = await Promise.all(
      companies.map(async (comp) => {
        const jobsCount = await Job.countDocuments({
          company: comp._id,
          status: 'active',
        });
        return {
          ...comp.toObject(),
          openJobsCount: jobsCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: companiesWithCount.length,
      companies: companiesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const jobs = await Job.find({ company: company._id, status: 'active' }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      company,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in recruiter's company profile
// @route   GET /api/companies/my-company
// @access  Private (Recruiter)
export const getMyCompany = async (req, res, next) => {
  try {
    let company = await Company.findOne({ recruiter: req.user.id });

    if (!company) {
      return res.status(200).json({
        success: true,
        company: null,
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update company profile
// @route   POST /api/companies/my-company
// @access  Private (Recruiter)
export const updateCompanyProfile = async (req, res, next) => {
  try {
    const { name, description, website, location, logo, industry, size } = req.body;

    let company = await Company.findOne({ recruiter: req.user.id });

    if (company) {
      if (name) company.name = name;
      if (description) company.description = description;
      if (website !== undefined) company.website = website;
      if (location) company.location = location;
      if (logo !== undefined) company.logo = logo;
      if (industry) company.industry = industry;
      if (size) company.size = size;

      await company.save();
    } else {
      company = await Company.create({
        name: name || 'My Company',
        description: description || 'Company description',
        website: website || '',
        location: location || 'Remote',
        logo: logo || '',
        industry: industry || 'Technology',
        size: size || '51-200',
        recruiter: req.user.id,
      });

      // Update recruiter's company reference
      await User.findByIdAndUpdate(req.user.id, { company: company._id });
    }

    res.status(200).json({
      success: true,
      message: 'Company profile saved successfully',
      company,
    });
  } catch (error) {
    next(error);
  }
};
