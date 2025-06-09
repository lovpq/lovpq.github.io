// Module data for newHikka
const modules = [
    {
        name: "GeminiAI",
        description: "Модуль для работы с Google Gemini AI. Поддерживает диалоги с памятью.",
        category: "utilities",
        icon: "bot",
        command: ".dlm @https://raw.githubusercontent.com/OCTPOBCEKPETOB/newHikka/refs/heads/main/gemini_with_memory-1.0.py"
    },
    {
        name: "FunGames",
        description: "Коллекция мини-игр и развлечений для чата.",
        category: "entertainment",
        icon: "gamepad-2",
        command: ".dlmod newHikka"
    },
    {
        name: "AdminTools",
        description: "Набор инструментов для администрирования групп.",
        category: "admin",
        icon: "shield",
        command: ".dlmod newHikka"
    },
    {
        name: "MusicPlayer",
        description: "Музыкальный плеер с поддержкой различных платформ.",
        category: "music",
        icon: "music",
        command: ".dlmod newHikka"
    },
    {
        name: "SocialMedia",
        description: "Интеграция с популярными социальными сетями.",
        category: "social",
        icon: "share-2",
        command: ".dlmod newHikka"
    }
];

// Category icons mapping
const categoryIcons = {
    utilities: 'settings',
    entertainment: 'gamepad-2',
    admin: 'shield',
    music: 'music',
    social: 'share-2'
};

// Category names mapping
const categoryNames = {
    utilities: 'Утилиты',
    entertainment: 'Развлечения',
    admin: 'Администрирование',
    music: 'Музыка',
    social: 'Соцсети'
};

// Generate module code
function generateModuleCode(module) {
    const commandMethods = module.commands.map(cmd => {
        const methodName = cmd.replace('.', '') + 'cmd';
        return `
    async def ${methodName}(self, message):
        """${module.description}"""
        await utils.answer(message, self.strings["loading"])
        
        try:
            # ${cmd} command implementation
            # Add your module logic here
            result = f"Command ${cmd} executed successfully"
            await utils.answer(message, f"<b>{self.strings['success']}</b>\\n{result}")
        except Exception as e:
            logger.error(f"Error in ${module.name} ${cmd}: {e}")
            await utils.answer(message, f"{self.strings['error']}: {e}")`;
    }).join('\n');

    return `# ${module.name} Module for Hikka Userbot
# Description: ${module.description}
# Author: newHikka Team
# Version: 1.0
# Category: ${module.category}

import logging
from .. import loader, utils

logger = logging.getLogger(__name__)

@loader.tds
class ${module.name}Mod(loader.Module):
    """${module.description}"""
    
    strings = {
        "name": "${module.name}",
        "loading": "⏳ <b>Loading...</b>",
        "success": "✅ <b>Success!</b>",
        "error": "❌ <b>Error occurred</b>",
        "no_args": "❌ <b>No arguments provided</b>",
        "invalid_args": "❌ <b>Invalid arguments</b>"
    }
    
    strings_ru = {
        "loading": "⏳ <b>Загрузка...</b>",
        "success": "✅ <b>Успешно!</b>",
        "error": "❌ <b>Произошла ошибка</b>",
        "no_args": "❌ <b>Аргументы не указаны</b>",
        "invalid_args": "❌ <b>Неверные аргументы</b>"
    }
    
    def __init__(self):
        self.config = loader.ModuleConfig(
            loader.ConfigValue(
                "auto_migrate",
                True,
                "Automatically migrate data from previous versions",
                validator=loader.validators.Boolean()
            ),
        )
    
    async def client_ready(self, client, db):
        self.client = client
        self.db = db
        self._db = db
        logger.info(f"{self.strings['name']} module loaded successfully")
        
        # Module initialization
        # Add your initialization code here
    
    async def on_unload(self):
        """Called when module is being unloaded"""
        logger.info(f"{self.strings['name']} module unloaded")
${commandMethods}
    
    # Helper methods
    def _validate_args(self, args):
        """Validate command arguments"""
        return len(args) > 0
    
    def _format_output(self, data):
        """Format output data"""
        if isinstance(data, dict):
            return "\\n".join([f"<b>{k}:</b> {v}" for k, v in data.items()])
        return str(data)
`;
}

// Download module function
function downloadModule(module) {
    const fileContent = generateModuleCode(module);
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${module.name.toLowerCase()}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Format date function
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

// Create module card HTML
function createModuleCard(module) {
    const iconName = categoryIcons[module.category];
    const categoryName = categoryNames[module.category];
    
    return `
        <div class="module-card" data-name="${module.name}" data-description="${module.description}" data-category="${module.category}">
            <div class="module-header">
                <div class="module-info">
                    <div class="module-icon ${module.category}">
                        <i data-lucide="${iconName}"></i>
                    </div>
                    <div class="module-meta">
                        <h3>${module.name}</h3>
                        <span class="module-category">${categoryName}</span>
                    </div>
                </div>
                <div class="module-rating">
                    <i data-lucide="star"></i>
                    <span>${module.rating}</span>
                </div>
            </div>
            
            <p class="module-description">${module.description}</p>
            
            <div class="module-stats">
                <span><i data-lucide="download"></i> ${module.downloads}</span>
                <span><i data-lucide="calendar"></i> ${formatDate(module.lastUpdate)}</span>
            </div>
            
            <div class="module-actions">
                <button class="btn btn-primary btn-small" onclick="downloadModule(modules.find(m => m.id === ${module.id}))">
                    <i data-lucide="download"></i>
                    Скачать
                </button>
                <button class="btn btn-secondary btn-small" onclick="showModuleDetails(${module.id})">
                    <i data-lucide="eye"></i>
                    Подробнее
                </button>
            </div>
        </div>
    `;
}

// Show module details (simplified modal)
function showModuleDetails(moduleId) {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const features = module.features.map(f => `• ${f}`).join('\n');
    const commands = module.commands.join(', ');
    
    alert(`${module.name}

Описание: ${module.description}

Возможности:
${features}

Команды: ${commands}

Статистика:
• Скачиваний: ${module.downloads}
• Рейтинг: ${module.rating}/5
• Обновлено: ${formatDate(module.lastUpdate)}`);
}

// Load modules function
function loadModules() {
    const modulesGrid = document.getElementById('modulesGrid');
    modulesGrid.innerHTML = ''; // Очищаем контейнер
    
    modules.forEach(module => {
        const moduleCard = document.createElement('div');
        moduleCard.className = 'module-card';
        moduleCard.dataset.category = module.category;
        
        moduleCard.innerHTML = `
            <div class="module-header">
                <div class="module-icon">
                    <i data-lucide="${module.icon}"></i>
                </div>
                <div class="module-meta">
                    <h3>${module.name}</h3>
                </div>
            </div>
            <p class="module-description">${module.description}</p>
            <button class="btn btn-primary download-btn" data-command="${module.command}">
                <i data-lucide="download"></i>
                Скачать
            </button>
        `;
        
        modulesGrid.appendChild(moduleCard);
    });
    
    // Инициализируем иконки Lucide для новых элементов
    lucide.createIcons();

    // Добавляем обработчики для кнопок скачивания
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const command = this.dataset.command;
            navigator.clipboard.writeText(command).then(() => {
                // Временно меняем текст кнопки
                const originalText = this.innerHTML;
                this.innerHTML = '<i data-lucide="check"></i> Скопировано!';
                lucide.createIcons();
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    lucide.createIcons();
                }, 2000);
            });
        });
    });
}

// Функция для фильтрации модулей
function filterModules() {
    try {
        const searchInput = document.getElementById('searchInput');
        const activeCategoryBtn = document.querySelector('.filter-btn.active');
        const moduleCards = document.querySelectorAll('.module-card');
        
        if (!searchInput || !activeCategoryBtn || !moduleCards.length) return;
        
        const searchTerm = (searchInput.value || '').toLowerCase();
        const activeCategory = activeCategoryBtn.dataset.category || 'all';
        
        moduleCards.forEach(card => {
            try {
                const nameElement = card.querySelector('h3');
                const descriptionElement = card.querySelector('.module-description');
                
                if (!nameElement || !descriptionElement) return;
                
                const name = (nameElement.textContent || '').toLowerCase();
                const description = (descriptionElement.textContent || '').toLowerCase();
                const category = card.dataset.category || '';
                
                const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
                const matchesCategory = activeCategory === 'all' || category === activeCategory;
                
                card.style.display = matchesSearch && matchesCategory ? 'flex' : 'none';
            } catch (cardError) {
                console.error('Error processing card:', cardError);
            }
        });
    } catch (error) {
        console.error('Error in filterModules:', error);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Загружаем модули
        loadModules();
        
        // Добавляем обработчики для кнопок фильтрации
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons.length > 0) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    filterModules();
                });
            });
        }
        
        // Добавляем обработчик для поиска
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', filterModules);
        }
        
        // Устанавливаем начальную фильтрацию
        setTimeout(filterModules, 100);
    } catch (error) {
        console.error('Error in initialization:', error);
    }
});