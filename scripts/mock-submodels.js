const { model, orderRepo, serviceRepo, therapistRepo } = require('./mock-models');

const orderSummaryRepo = model({
    type: 'object',
    properties: {
        id: { type: 'number' },
        uid: { type: 'string' },
        user_id: { type: 'number' },
        user_avatar: { type: 'string' },
        therapist_id: { type: 'number' },
        service_id: { type: 'number' },
        service_name: { type: 'string' },
        service_description: { type: 'string' },
        order_status: { type: 'string' },
        appointment_date: { type: 'string' },
        appointment_duration: { type: 'string' },
        total_price: { type: 'number' },
        note: { type: 'string' },
        location: {
            type: 'object',
            properties: {
                x: { type: 'number' },
                y: { type: 'number' },
            },
        },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
    },
}, (data) => {
    return {
        id: data.id,
        uid: data.uid,
        user_id: data.user_id,
        user_avatar: data.user_avatar,
        therapist_id: data.therapist_id,
        service_id: data.service_id,
        service_name: data.service_name,
        service_description: data.service_description,
        order_status: data.order_status,
        appointment_date: data.appointment_date,
        appointment_duration: data.appointment_duration,
        total_price: data.total_price,
        note: data.note,
        location: data.location,
        created_at: data.created_at,
        updated_at: data.updated_at,
    };
});

const serviceSummaryRepo = model({
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
    },
}, (data) => {
    return {
        id: data.id,
        name: data.name,
    };
});

const therapistSummaryRepo = model({
    type: 'object',
    properties: {
        id: { type: 'number' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        location: {
            type: 'object',
            properties: {
                x: { type: 'number' },
                y: { type: 'number' },
            },
        },
        experience_years: { type: 'number' },
        photo: { type: 'string' },
        age: { type: 'number' },
        gender: { type: 'string' },
        is_available: { type: 'string' },
        rating: { type: 'string' },
        services: { type: 'array', items: serviceSummaryRepo.schema },
    },
}, (data) => {
    const summaryServices = (data.services ?? []).map((service) => {
        const summaryService = serviceSummaryRepo.find((ss) => ss.id === service.id);
        return summaryService;
    });
    return {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        location: data.location,
        experience_years: data.experience_years,
        photo: data.photo,
        age: data.age,
        gender: data.gender,
        is_available: data.is_available,
        rating: data.rating,
        services: summaryServices,
    };
});

for (const order of orderRepo.items) {
    orderSummaryRepo.create(order);
}

for (const service of serviceRepo.items) {
    serviceSummaryRepo.create(service);
}

for (const therapist of therapistRepo.items) {
    therapistSummaryRepo.create(therapist);
}

module.exports = {
    orderSummaryRepo,
    serviceSummaryRepo,
    therapistSummaryRepo,
};
