from services.data_loader import load_all_college_data

colleges = load_all_college_data()
college_results = predict_colleges(user_rank, colleges)