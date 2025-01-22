// src/controllers/searchController.js
const Skill = require('../models/Skill');
const User = require('../models/User');

exports.searchSkills = async (req, res) => {
  try {
    const {
      query,          // busca por texto
      category,       // categoria específica
      level,          // nível de experiência
      location,       // localização do usuário
      minRating,      // avaliação mínima
      available,      // disponibilidade
      page = 1,
      limit = 10
    } = req.query;

    // Pipeline de agregação
    const pipeline = [];

    // Junção com a coleção de usuários
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
      }
    });

    // Descompactar array de userInfo
    pipeline.push({
      $unwind: '$userInfo'
    });

    // Construir condições de filtro
    const matchConditions = {};

    // Busca por texto em nome ou descrição
    if (query) {
      matchConditions.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Filtros exatos
    if (category) {
      matchConditions.category = category;
    }

    if (level) {
      matchConditions.level = level;
    }

    if (available !== undefined) {
      matchConditions.available = available === 'true';
    }

    // Filtro de localização do usuário
    if (location) {
      matchConditions['userInfo.location'] = { 
        $regex: location, 
        $options: 'i' 
      };
    }

    // Filtro de avaliação mínima
    if (minRating) {
      matchConditions['userInfo.rating'] = { 
        $gte: parseFloat(minRating) 
      };
    }

    // Adicionar estágio de filtro se houver condições
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // Calcular total de resultados
    const totalPipeline = [...pipeline];
    totalPipeline.push({ $count: 'total' });
    const totalResults = await Skill.aggregate(totalPipeline);
    const total = totalResults[0]?.total || 0;

    // Adicionar ordenação
    pipeline.push({
      $sort: {
        'userInfo.rating': -1,
        createdAt: -1
      }
    });

    // Adicionar paginação
    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    );

    // Formatar o resultado
    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        category: 1,
        level: 1,
        available: 1,
        exchangePreferences: 1,
        createdAt: 1,
        user: {
          _id: '$userInfo._id',
          name: '$userInfo.name',
          email: '$userInfo.email',
          location: '$userInfo.location',
          rating: '$userInfo.rating'
        }
      }
    });

    // Executar a agregação
    const skills = await Skill.aggregate(pipeline);

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        skills,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao realizar busca'
    });
  }
};

// Busca de sugestões para autocompletar
exports.getSkillSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    const suggestions = await Skill.aggregate([
      {
        $match: {
          name: { $regex: `^${query}`, $options: 'i' }
        }
      },
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.status(200).json({
      success: true,
      data: suggestions.map(s => s._id)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar sugestões'
    });
  }
};